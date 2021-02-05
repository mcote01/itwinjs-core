/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// cSpell:ignore Modeless WMTS

import * as React from "react";
import { Dialog, DialogButtonType, Icon, Input, InputStatus, LabeledInput, ProgressBar, Radio, Select } from "@bentley/ui-core";
import { ModalDialogManager } from "@bentley/ui-framework";
import { MapLayersUiItemsProvider } from "../MapLayersUiItemsProvider";
import { MapTypesOptions } from "../Interfaces";
import {
  IModelApp, MapLayerImageryProviderStatus, MapLayerSettingsService, MapLayerSource,
  MapLayerSourceStatus, NotifyMessageDetails, OutputMessagePriority, ScreenViewport,
} from "@bentley/imodeljs-frontend";
import { MapLayerProps, MapLayerSettings } from "@bentley/imodeljs-common";
import "./MapUrlDialog.scss";

export const MAP_TYPES = {
  wms: "WMS",
  arcGis: "ArcGIS",
  wmts: "WMTS",
  tileUrl: "TileURL",
};

interface MapUrlDialogProps {
  activeViewport?: ScreenViewport;
  isOverlay: boolean;
  onOkResult: () => void;
  mapTypesOptions?: MapTypesOptions;

  // An optional layer definition can be provide to enable the edit mpde
  layerToEdit?: MapLayerProps;

  // Dialog will disabled all fields except username/password, and
  // will force user to provider
  askForCredentialsOnly?: boolean;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function MapUrlDialog(props: MapUrlDialogProps) {
  const { isOverlay, onOkResult, mapTypesOptions } = props;

  const [dialogTitle] = React.useState(MapLayersUiItemsProvider.i18n.translate(props.layerToEdit ? "mapLayers:CustomAttach.EditCustomLayer" : "mapLayers:CustomAttach.AttachCustomLayer"));
  const [typeLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.Type"));
  const [nameLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.Name"));
  const [urlLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.URL"));
  const [projectSettingsLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.StoreOnProjectSettings"));
  const [modelSettingsLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.StoreOnModelSettings"));
  const [missingCredentialsLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.MissingCredentials"));
  const [invalidCredentialsLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.InvalidCredentials"));
  const [serverRequireCredentials, setServerRequireCredentials] = React.useState(props.askForCredentialsOnly ?? false);
  const [invalidCredentialsProvided, setInvalidCredentialsProvided] = React.useState(false);
  const [layerAttachPending, setLayerAttachPending] = React.useState(false);
  const [warningMessage, setWarningMessage] = React.useState(props.askForCredentialsOnly ? missingCredentialsLabel : undefined);
  const [mapUrl, setMapUrl] = React.useState(props.layerToEdit?.url ?? "");
  const [mapName, setMapName] = React.useState(props.layerToEdit?.name ?? "");
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [noSaveSettingsWarning] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.NoSaveSettingsWarning"));
  const [passwordLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:AuthenticationInputs.Password"));
  const [userNameLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:AuthenticationInputs.Username"));
  const [settingsStorage, setSettingsStorageRadio] = React.useState("Project");

  // Is Setting service available (i.e. should we should the options in the UI and attempt to save to settings service)
  const [settingsStorageAvailable] = React.useState(!props.askForCredentialsOnly && !!IModelApp.viewManager?.selectedView?.iModel?.contextId && !!IModelApp.viewManager?.selectedView?.iModel?.iModelId);

  // Even though the settings storage is available, we might want to disable it in the UI
  const [settingsStorageDisabled, setSettingsStorageDisabled] = React.useState(settingsStorageAvailable);
  const [mapType, setMapType] = React.useState(props.layerToEdit?.formatId ?? MAP_TYPES.arcGis);

  const [mapTypes] = React.useState((): string[] => {
    const types = [MAP_TYPES.arcGis, MAP_TYPES.wms, MAP_TYPES.wmts];
    if (mapTypesOptions?.supportTileUrl)
      types.push(MAP_TYPES.tileUrl);
    return types;
  });

  const [authSupported] = React.useState(() =>
    (mapType === MAP_TYPES.wms && (mapTypesOptions?.supportWmsAuthentication ? true : false))
    || mapType === MAP_TYPES.arcGis);

  const [layerIdxToEdit] = React.useState((): number | undefined => {
    if (props.layerToEdit === undefined || !props.layerToEdit.name || !props.layerToEdit.url) {
      return undefined;
    }

    const indexInDisplayStyle = props.activeViewport?.displayStyle.findMapLayerIndexByNameAndUrl(props.layerToEdit.name, props.layerToEdit.url, isOverlay);
    if (indexInDisplayStyle === undefined || indexInDisplayStyle < 0) {
      return undefined;
    } else {
      return indexInDisplayStyle;
    }
  });

  const [layerToEdit] = React.useState((): MapLayerSettings | undefined => {
    if (props.layerToEdit === undefined || layerIdxToEdit === undefined) {
      return undefined;
    }
    return props.activeViewport?.displayStyle.mapLayerAtIndex(layerIdxToEdit, props.isOverlay);
  });

  // Update warning message based on the dialog state and server response
  React.useEffect(() => {
    if (invalidCredentialsProvided) {
      setWarningMessage(invalidCredentialsLabel);
    } else if (serverRequireCredentials && (!userName || !password)) {
      setWarningMessage(missingCredentialsLabel);
    } else {
      setWarningMessage(undefined);
    }
  }, [invalidCredentialsProvided, invalidCredentialsLabel, missingCredentialsLabel, serverRequireCredentials, userName, password, setWarningMessage]);

  const handleMapTypeSelection = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setMapType(e.target.value);
    e.preventDefault();
  }, [setMapType]);

  const handleCancel = React.useCallback(() => {
    ModalDialogManager.closeDialog();
  }, []);

  const onUsernameChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
    if (invalidCredentialsProvided)
      setInvalidCredentialsProvided(false);
  }, [setUserName, invalidCredentialsProvided, setInvalidCredentialsProvided]);

  const onPasswordChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (invalidCredentialsProvided)
      setInvalidCredentialsProvided(false);
  }, [setPassword, invalidCredentialsProvided, setInvalidCredentialsProvided]);

  React.useEffect(() => {
    if (settingsStorageAvailable) {
      setSettingsStorageDisabled(mapType === MAP_TYPES.wms && (userName.length > 0 || password.length > 0));
    }
  }, [mapType, userName, password, setSettingsStorageDisabled, settingsStorageAvailable]);

  const doAttach = React.useCallback(async (source: MapLayerSource): Promise<boolean> => {

    // Returns a promise, When true, the dialog should closed
    return new Promise((resolve, _reject) => {

      const vp = IModelApp.viewManager.selectedView;
      if (vp === undefined || source === undefined) {
        resolve(true);
        return;
      }

      const storeOnIModel = "Model" === settingsStorage;
      source.validateSource(true).then(async (validation) => {
        if (validation.status === MapLayerSourceStatus.Valid
          || validation.status === MapLayerSourceStatus.RequireAuth
          || validation.status === MapLayerSourceStatus.InvalidCredentials) {
          const sourceRequireAuth = (validation.status === MapLayerSourceStatus.RequireAuth);
          const invalidCredentials = (validation.status === MapLayerSourceStatus.InvalidCredentials);
          resolve(!sourceRequireAuth && !invalidCredentials);

          if (sourceRequireAuth && !serverRequireCredentials) {
            setServerRequireCredentials(true);
          }
          if (invalidCredentials) {
            setInvalidCredentialsProvided(true);
            return;
          } else if (invalidCredentialsProvided) {
            setInvalidCredentialsProvided(false);  // flag reset
          }

          if (validation.status === MapLayerSourceStatus.Valid) {
            source.subLayers = validation.subLayers;

            // Attach layer and update settings service (only if not editing)
            if (layerIdxToEdit !== undefined) {
              // Update username / password
              vp.displayStyle.changeMapLayerProps({
                userName: source.userName,
                password: source.password,
                subLayers: validation.subLayers,
              }, layerIdxToEdit, isOverlay);

              // Reset the provider's status
              const provider = vp.displayStyle.getMapLayerImageryProvider(layerIdxToEdit, isOverlay);
              if (provider && provider.status !== MapLayerImageryProviderStatus.Valid) {
                provider.status = MapLayerImageryProviderStatus.Valid;
              }
            } else {
              if (!settingsStorageDisabled) {
                if (!(await MapLayerSettingsService.storeSourceInSettingsService(source, storeOnIModel, vp.iModel.contextId!, vp.iModel.iModelId!)))
                  return;
              }
              vp.displayStyle.attachMapLayer(source, isOverlay);

              const msg = IModelApp.i18n.translate("mapLayers:Messages.MapLayerAttached", { sourceName: source.name, sourceUrl: source.url });
              IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Info, msg));
            }

            vp.invalidateRenderPlan();
          }
          onOkResult();
        } else {
          const msg = MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.ValidationError");
          IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Info, `${msg} ${source.url}`));
          resolve(true);
        }
      }).catch((error) => {
        const msg = MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.AttachError");
        IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Info, `${msg} ${source.url}-${error}`));
        resolve(true);
      });
    });
  }, [isOverlay, onOkResult, settingsStorage, settingsStorageDisabled, invalidCredentialsProvided, layerIdxToEdit, serverRequireCredentials]);

  const onNameChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMapName(event.target.value);
  }, [setMapName]);

  const onRadioChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSettingsStorageRadio(event.target.value);
  }, [setSettingsStorageRadio]);

  const onUrlChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMapUrl(event.target.value);
  }, [setMapUrl]);

  const handleOk = React.useCallback(() => {
    let closeDialogImmediately = true;

    if (mapUrl && mapName) {
      const source = MapLayerSource.fromJSON({
        url: mapUrl,
        name: mapName,
        formatId: mapType,
        userName,
        password,
      });

      if (source) {

        closeDialogImmediately = false;
        setLayerAttachPending(true);
        doAttach(source).then((closeDialog) => {
          setLayerAttachPending(false);
          if (closeDialog) {
            ModalDialogManager.closeDialog();
          }
        }).catch(() => {
          ModalDialogManager.closeDialog();
        });
      }

      if (closeDialogImmediately)
        ModalDialogManager.closeDialog();
    }
  }, [doAttach, mapName, mapUrl, mapType, userName, password]);

  const dialogContainer = React.useRef<HTMLDivElement>(null);

  const readyToSave = React.useCallback(() => {
    const credentialsSet = !!userName && !!password;
    return (!!mapUrl && !!mapName)
      && (!serverRequireCredentials || (serverRequireCredentials && credentialsSet) && !layerAttachPending)
      && !invalidCredentialsProvided;
  }, [mapUrl, mapName, userName, password, layerAttachPending, invalidCredentialsProvided, serverRequireCredentials]);

  const buttonCluster = React.useMemo(() => [
    { type: DialogButtonType.OK, onClick: handleOk, disabled: !readyToSave() },
    { type: DialogButtonType.Cancel, onClick: handleCancel },
  ], [readyToSave, handleCancel, handleOk]);

  return (
    <div ref={dialogContainer}>
      <Dialog
        style={{ zIndex: 21000 }}
        title={dialogTitle}
        opened={true}
        resizable={true}
        movable={true}
        modal={true}
        buttonCluster={buttonCluster}
        onClose={handleCancel}
        onEscape={handleCancel}
        minHeight={120}
        maxWidth={600}
        trapFocus={false}
      >
        <div>
          <div className="map-layer-source-url">
            <span className="map-layer-source-label">{typeLabel}</span>
            <Select className="map-manager-base-select" options={mapTypes} value={mapType} disabled={props.askForCredentialsOnly} onChange={handleMapTypeSelection} />
            <span className="map-layer-source-label">{nameLabel}</span>
            <Input placeholder="Enter Map Name" onChange={onNameChange} value={props.layerToEdit?.name || layerToEdit?.name} disabled={props.askForCredentialsOnly} />
            <span className="map-layer-source-label">{urlLabel}</span>
            <Input placeholder="Enter Map Source URL" onChange={onUrlChange} value={props.layerToEdit?.url || layerToEdit?.url} disabled={props.askForCredentialsOnly} />
            {authSupported &&
              <>
                <span className="map-layer-source-label">{userNameLabel}</span>
                <LabeledInput placeholder={serverRequireCredentials ? "Username required" : userNameLabel}
                  status={!userName && serverRequireCredentials ? InputStatus.Warning : undefined}
                  onChange={onUsernameChange} />

                <span className="map-layer-source-label">{passwordLabel}</span>
                <LabeledInput type="password" placeholder={serverRequireCredentials ? "Password required" : passwordLabel}
                  status={!password && serverRequireCredentials ? InputStatus.Warning : undefined}
                  onChange={onPasswordChange} />
              </>
            }

            {/* Store settings options, not shown when editing a layer */}
            {settingsStorageAvailable && <div title={settingsStorageDisabled ? noSaveSettingsWarning : ""}>
              <Radio disabled={settingsStorageDisabled}
                name="settingsStorage" value="Project"
                label={projectSettingsLabel} checked={settingsStorage === "Project"}
                onChange={onRadioChange} />
              <Radio disabled={settingsStorageDisabled}
                name="settingsStorage" value="Model"
                label={modelSettingsLabel} checked={settingsStorage === "Model"}
                onChange={onRadioChange} />
            </div>}
          </div>
        </div>

        {/* Warning message */}
        <div className="map-layer-source-warnMessage">
          {warningMessage ?
            <>
              <Icon className="map-layer-source-warnMessage-icon" iconSpec="icon-status-warning" />
              <span className="map-layer-source-warnMessage-label">{warningMessage}</span >
            </>
            :
            // Place holder to avoid dialog resize
            <span className="map-layer-source-placeholder">&nbsp;</span>
          }
        </div>

        {/* Progress bar */}
        {layerAttachPending &&
          <div className="map-layer-source-progressBar">
            <ProgressBar indeterminate />
          </div>
        }
      </Dialog>
    </div >
  );
}
