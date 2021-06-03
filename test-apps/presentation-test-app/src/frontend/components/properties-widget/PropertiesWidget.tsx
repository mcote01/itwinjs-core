/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import "./PropertiesWidget.css";
import * as React from "react";
import { IDisposable } from "@bentley/bentleyjs-core";
import { IModelApp, IModelConnection } from "@bentley/imodeljs-frontend";
import {
  DiagnosticsProps, IPresentationPropertyDataProvider, PresentationPropertyDataProvider, usePropertyDataProviderWithUnifiedSelection,
} from "@bentley/presentation-components";
import { FavoritePropertiesScope } from "@bentley/presentation-frontend";
import { PropertyRecord, PropertyValueFormat } from "@bentley/ui-abstract";
import {
  FilteredPropertyData, FilteredType, FilteringInput, FilteringInputStatus, FilteringPropertyDataProvider, IPropertyDataProvider, PropertyCategory,
  PropertyData, PropertyDataChangeEvent, PropertyDataFilterResult, PropertyRecordDataFiltererBase, VirtualizedPropertyGridWithDataProvider,
} from "@bentley/ui-components";
import { HighlightInfo } from "@bentley/ui-components/lib/ui-components/common/HighlightingComponentProps";
import { FillCentered, Orientation, Toggle, useDisposable } from "@bentley/ui-core";
import { DiagnosticsSelector } from "../diagnostics-selector/DiagnosticsSelector";

const FAVORITES_SCOPE = FavoritePropertiesScope.IModel;

export interface Props {
  imodel: IModelConnection;
  rulesetId?: string;
  onFindSimilar?: (propertiesProvider: IPresentationPropertyDataProvider, record: PropertyRecord) => void;
}

export function PropertiesWidget(props: Props) {
  const { imodel, rulesetId, onFindSimilar } = props;
  const [diagnosticsOptions, setDiagnosticsOptions] = React.useState<DiagnosticsProps>({ ruleDiagnostics: undefined, devDiagnostics: undefined });

  const [filterText, setFilterText] = React.useState("");
  const [isFavoritesFilterActive, setIsFavoritesFilterActive] = React.useState(false);
  const [activeMatchIndex, setActiveMatchIndex] = React.useState(0);
  const [activeHighlight, setActiveHighlight] = React.useState<HighlightInfo>();

  const setFilter = React.useCallback((filter) => {
    if (filter !== filterText)
      setFilterText(filter);
  }, [filterText]);

  const [filteringResult, setFilteringResult] = React.useState<FilteredPropertyData>();
  const resultSelectorProps = React.useMemo(() => {
    return filteringResult?.matchesCount !== undefined ? {
      onSelectedChanged: (index: React.SetStateAction<number>) => setActiveMatchIndex(index),
      resultCount: filteringResult.matchesCount,
    } : undefined;
  }, [filteringResult]);

  const onFilteringStateChanged = React.useCallback((newFilteringResult: FilteredPropertyData | undefined) => {
    setFilteringResult(newFilteringResult);
    if (newFilteringResult?.getMatchByIndex)
      setActiveHighlight(newFilteringResult.getMatchByIndex(activeMatchIndex));
  }, [activeMatchIndex]);

  return (
    <div className="PropertiesWidget">
      <h3>{IModelApp.i18n.translate("Sample:controls.properties.widget-label")}</h3>
      <DiagnosticsSelector onDiagnosticsOptionsChanged={setDiagnosticsOptions} />
      {rulesetId
        ? (<div className="SearchBar">
          <FilteringInput
            onFilterCancel={() => { setFilter(""); }}
            onFilterClear={() => { setFilter(""); }}
            onFilterStart={(newFilter) => { setFilter(newFilter); }}
            style={{ flex: "auto" }}
            resultSelectorProps={resultSelectorProps}
            status={filterText.length !== 0 ? FilteringInputStatus.FilteringFinished : FilteringInputStatus.ReadyToFilter}
          />
          <Toggle
            title="Favorites"
            onChange={(on) => setIsFavoritesFilterActive(on)}
          />
        </div>)
        : null}
      <div className="ContentContainer">
        {rulesetId
          ? <PropertyGrid
            imodel={imodel}
            rulesetId={rulesetId}
            filtering={{ filter: filterText, onlyFavorites: isFavoritesFilterActive, activeHighlight, onFilteringStateChanged }}
            onFindSimilar={onFindSimilar}
            diagnostics={diagnosticsOptions}
          />
          : null
        }
      </div>
    </div>
  );
}

interface PropertyGridProps {
  imodel: IModelConnection;
  rulesetId: string;
  diagnostics: DiagnosticsProps;
  filtering: {
    filter: string;
    onlyFavorites: boolean;
    activeHighlight?: HighlightInfo;
    onFilteringStateChanged: (result: FilteredPropertyData | undefined) => void;
  };
  onFindSimilar?: (propertiesProvider: IPresentationPropertyDataProvider, record: PropertyRecord) => void;
}
function PropertyGrid(props: PropertyGridProps) {
  const { imodel, rulesetId, diagnostics } = props;

  const dataProvider = useDisposable(React.useCallback(
    () => {
      const provider = new PresentationPropertyDataProvider({ imodel, ruleset: rulesetId, ...diagnostics });
      provider.isNestedPropertyCategoryGroupingEnabled = true;
      return provider;
    }, [imodel, rulesetId, diagnostics]));
  const { isOverLimit, numSelectedElements } = usePropertyDataProviderWithUnifiedSelection({ dataProvider });

  const filteringDataProvider = useDisposable(React.useCallback(() => {
    const nonEmptyValuesFilterer = new NonEmptyValuesPropertyDataFilterer();
    return new AutoExpandingPropertyDataProvider(new FilteringPropertyDataProvider(dataProvider, nonEmptyValuesFilterer));
  }, [dataProvider]));

  if (numSelectedElements === 0) {
    return <FillCentered>{IModelApp.i18n.translate("Sample:property-grid.no-elements-selected")}</FillCentered>;
  }

  if (isOverLimit) {
    return <FillCentered>{IModelApp.i18n.translate("Sample:property-grid.too-many-elements-selected")}</FillCentered>;
  }

  return <>
    <VirtualizedPropertyGridWithDataProvider
      dataProvider={filteringDataProvider}
      orientation={Orientation.Horizontal}
      horizontalOrientationMinWidth={500}
    />
  </>;
}

type CustomPropertyDataProvider<TPropertyData> = IDisposable & Omit<IPropertyDataProvider, "getData"> & { getData: () => Promise<TPropertyData> };
class AutoExpandingPropertyDataProvider<TPropertyData extends PropertyData> implements IPropertyDataProvider, IDisposable {
  public onDataChanged = new PropertyDataChangeEvent();
  public constructor(private _wrapped: CustomPropertyDataProvider<TPropertyData>) {
    this._wrapped.onDataChanged.addListener(() => this.onDataChanged.raiseEvent());
  }
  public dispose() { this._wrapped.dispose(); }
  public async getData(): Promise<TPropertyData> {
    function expandCategories(categories: PropertyCategory[]) {
      categories.forEach((category: PropertyCategory) => {
        category.expand = true;
        if (category.childCategories)
          expandCategories(category.childCategories);
      });
    }
    const result = await this._wrapped.getData();
    expandCategories(result.categories);
    return result;
  }
}

class NonEmptyValuesPropertyDataFilterer extends PropertyRecordDataFiltererBase {
  public get isActive() { return true; }
  public async recordMatchesFilter(node: PropertyRecord): Promise<PropertyDataFilterResult> {
    if (node.value.valueFormat === PropertyValueFormat.Primitive)
      return { filteredTypes: [FilteredType.Value], matchesFilter: !!node.value.displayValue };

    if (node.value.valueFormat === PropertyValueFormat.Array)
      return { filteredTypes: [FilteredType.Value], matchesFilter: node.value.items.length > 0 };

    if (node.value.valueFormat === PropertyValueFormat.Struct)
      return { filteredTypes: [FilteredType.Value], matchesFilter: Object.keys(node.value.members).length > 0 };

    return { matchesFilter: false };
  }
}
