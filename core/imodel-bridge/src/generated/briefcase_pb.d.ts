/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// package: TwoProcessConnector
// file: briefcase.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class ExternalSourceAspectIdentifier extends jspb.Message { 
    getScopeid(): string;
    setScopeid(value: string): ExternalSourceAspectIdentifier;
    getIdentifier(): string;
    setIdentifier(value: string): ExternalSourceAspectIdentifier;
    getKind(): string;
    setKind(value: string): ExternalSourceAspectIdentifier;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExternalSourceAspectIdentifier.AsObject;
    static toObject(includeInstance: boolean, msg: ExternalSourceAspectIdentifier): ExternalSourceAspectIdentifier.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExternalSourceAspectIdentifier, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExternalSourceAspectIdentifier;
    static deserializeBinaryFromReader(message: ExternalSourceAspectIdentifier, reader: jspb.BinaryReader): ExternalSourceAspectIdentifier;
}

export namespace ExternalSourceAspectIdentifier {
    export type AsObject = {
        scopeid: string,
        identifier: string,
        kind: string,
    }
}

export class CodeProps extends jspb.Message { 
    getSpec(): string;
    setSpec(value: string): CodeProps;
    getScope(): string;
    setScope(value: string): CodeProps;
    getValue(): string;
    setValue(value: string): CodeProps;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CodeProps.AsObject;
    static toObject(includeInstance: boolean, msg: CodeProps): CodeProps.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CodeProps, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CodeProps;
    static deserializeBinaryFromReader(message: CodeProps, reader: jspb.BinaryReader): CodeProps;
}

export namespace CodeProps {
    export type AsObject = {
        spec: string,
        scope: string,
        value: string,
    }
}

export class ElementLoadOptions extends jspb.Message { 

    hasWantgeometry(): boolean;
    clearWantgeometry(): void;
    getWantgeometry(): boolean | undefined;
    setWantgeometry(value: boolean): ElementLoadOptions;

    hasWantbrepdata(): boolean;
    clearWantbrepdata(): void;
    getWantbrepdata(): boolean | undefined;
    setWantbrepdata(value: boolean): ElementLoadOptions;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ElementLoadOptions.AsObject;
    static toObject(includeInstance: boolean, msg: ElementLoadOptions): ElementLoadOptions.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ElementLoadOptions, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ElementLoadOptions;
    static deserializeBinaryFromReader(message: ElementLoadOptions, reader: jspb.BinaryReader): ElementLoadOptions;
}

export namespace ElementLoadOptions {
    export type AsObject = {
        wantgeometry?: boolean,
        wantbrepdata?: boolean,
    }
}

export class TryGetElementPropsRequest extends jspb.Message { 

    hasId64(): boolean;
    clearId64(): void;
    getId64(): string | undefined;
    setId64(value: string): TryGetElementPropsRequest;

    hasFederationguid(): boolean;
    clearFederationguid(): void;
    getFederationguid(): string | undefined;
    setFederationguid(value: string): TryGetElementPropsRequest;

    hasCode(): boolean;
    clearCode(): void;
    getCode(): CodeProps | undefined;
    setCode(value?: CodeProps): TryGetElementPropsRequest;

    hasExternalsourceaspect(): boolean;
    clearExternalsourceaspect(): void;
    getExternalsourceaspect(): ExternalSourceAspectIdentifier | undefined;
    setExternalsourceaspect(value?: ExternalSourceAspectIdentifier): TryGetElementPropsRequest;

    hasElementloadoptions(): boolean;
    clearElementloadoptions(): void;
    getElementloadoptions(): ElementLoadOptions | undefined;
    setElementloadoptions(value?: ElementLoadOptions): TryGetElementPropsRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TryGetElementPropsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TryGetElementPropsRequest): TryGetElementPropsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TryGetElementPropsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TryGetElementPropsRequest;
    static deserializeBinaryFromReader(message: TryGetElementPropsRequest, reader: jspb.BinaryReader): TryGetElementPropsRequest;
}

export namespace TryGetElementPropsRequest {
    export type AsObject = {
        id64?: string,
        federationguid?: string,
        code?: CodeProps.AsObject,
        externalsourceaspect?: ExternalSourceAspectIdentifier.AsObject,
        elementloadoptions?: ElementLoadOptions.AsObject,
    }
}

export class GetExternalSourceAspectPropsRequest extends jspb.Message { 
    getExternalsourceaspectid(): string;
    setExternalsourceaspectid(value: string): GetExternalSourceAspectPropsRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetExternalSourceAspectPropsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetExternalSourceAspectPropsRequest): GetExternalSourceAspectPropsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetExternalSourceAspectPropsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetExternalSourceAspectPropsRequest;
    static deserializeBinaryFromReader(message: GetExternalSourceAspectPropsRequest, reader: jspb.BinaryReader): GetExternalSourceAspectPropsRequest;
}

export namespace GetExternalSourceAspectPropsRequest {
    export type AsObject = {
        externalsourceaspectid: string,
    }
}

export class ExternalSourceAspectProps extends jspb.Message { 
    getScopeid(): string;
    setScopeid(value: string): ExternalSourceAspectProps;
    getIdentifier(): string;
    setIdentifier(value: string): ExternalSourceAspectProps;
    getKind(): string;
    setKind(value: string): ExternalSourceAspectProps;
    getVersion(): string;
    setVersion(value: string): ExternalSourceAspectProps;
    getChecksum(): string;
    setChecksum(value: string): ExternalSourceAspectProps;
    getJsonproperties(): string;
    setJsonproperties(value: string): ExternalSourceAspectProps;
    getSource(): string;
    setSource(value: string): ExternalSourceAspectProps;
    getElement(): string;
    setElement(value: string): ExternalSourceAspectProps;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExternalSourceAspectProps.AsObject;
    static toObject(includeInstance: boolean, msg: ExternalSourceAspectProps): ExternalSourceAspectProps.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExternalSourceAspectProps, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExternalSourceAspectProps;
    static deserializeBinaryFromReader(message: ExternalSourceAspectProps, reader: jspb.BinaryReader): ExternalSourceAspectProps;
}

export namespace ExternalSourceAspectProps {
    export type AsObject = {
        scopeid: string,
        identifier: string,
        kind: string,
        version: string,
        checksum: string,
        jsonproperties: string,
        source: string,
        element: string,
    }
}

export class ElementProps extends jspb.Message { 
    getPropsjson(): string;
    setPropsjson(value: string): ElementProps;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ElementProps.AsObject;
    static toObject(includeInstance: boolean, msg: ElementProps): ElementProps.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ElementProps, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ElementProps;
    static deserializeBinaryFromReader(message: ElementProps, reader: jspb.BinaryReader): ElementProps;
}

export namespace ElementProps {
    export type AsObject = {
        propsjson: string,
    }
}
