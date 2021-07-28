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

    hasExternalsourceaspectidentifier(): boolean;
    clearExternalsourceaspectidentifier(): void;
    getExternalsourceaspectidentifier(): ExternalSourceAspectIdentifier | undefined;
    setExternalsourceaspectidentifier(value?: ExternalSourceAspectIdentifier): TryGetElementPropsRequest;

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
        externalsourceaspectidentifier?: ExternalSourceAspectIdentifier.AsObject,
    }
}

export class TryGetElementPropsResult extends jspb.Message { 

    hasPropsjson(): boolean;
    clearPropsjson(): void;
    getPropsjson(): string | undefined;
    setPropsjson(value: string): TryGetElementPropsResult;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TryGetElementPropsResult.AsObject;
    static toObject(includeInstance: boolean, msg: TryGetElementPropsResult): TryGetElementPropsResult.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TryGetElementPropsResult, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TryGetElementPropsResult;
    static deserializeBinaryFromReader(message: TryGetElementPropsResult, reader: jspb.BinaryReader): TryGetElementPropsResult;
}

export namespace TryGetElementPropsResult {
    export type AsObject = {
        propsjson?: string,
    }
}

export class ExternalSourceState extends jspb.Message { 

    hasVersion(): boolean;
    clearVersion(): void;
    getVersion(): string | undefined;
    setVersion(value: string): ExternalSourceState;

    hasChecksum(): boolean;
    clearChecksum(): void;
    getChecksum(): string | undefined;
    setChecksum(value: string): ExternalSourceState;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExternalSourceState.AsObject;
    static toObject(includeInstance: boolean, msg: ExternalSourceState): ExternalSourceState.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExternalSourceState, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExternalSourceState;
    static deserializeBinaryFromReader(message: ExternalSourceState, reader: jspb.BinaryReader): ExternalSourceState;
}

export namespace ExternalSourceState {
    export type AsObject = {
        version?: string,
        checksum?: string,
    }
}

export class ExternalSourceAspectProps extends jspb.Message { 
    getElementid(): string;
    setElementid(value: string): ExternalSourceAspectProps;

    hasIdentifier(): boolean;
    clearIdentifier(): void;
    getIdentifier(): ExternalSourceAspectIdentifier | undefined;
    setIdentifier(value?: ExternalSourceAspectIdentifier): ExternalSourceAspectProps;

    hasState(): boolean;
    clearState(): void;
    getState(): ExternalSourceState | undefined;
    setState(value?: ExternalSourceState): ExternalSourceAspectProps;
    getJsonproperties(): string;
    setJsonproperties(value: string): ExternalSourceAspectProps;

    hasSource(): boolean;
    clearSource(): void;
    getSource(): string | undefined;
    setSource(value: string): ExternalSourceAspectProps;

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
        elementid: string,
        identifier?: ExternalSourceAspectIdentifier.AsObject,
        state?: ExternalSourceState.AsObject,
        jsonproperties: string,
        source?: string,
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

export class DetectChangeRequest extends jspb.Message { 

    hasIdentifier(): boolean;
    clearIdentifier(): void;
    getIdentifier(): ExternalSourceAspectIdentifier | undefined;
    setIdentifier(value?: ExternalSourceAspectIdentifier): DetectChangeRequest;

    hasState(): boolean;
    clearState(): void;
    getState(): ExternalSourceState | undefined;
    setState(value?: ExternalSourceState): DetectChangeRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DetectChangeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DetectChangeRequest): DetectChangeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DetectChangeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DetectChangeRequest;
    static deserializeBinaryFromReader(message: DetectChangeRequest, reader: jspb.BinaryReader): DetectChangeRequest;
}

export namespace DetectChangeRequest {
    export type AsObject = {
        identifier?: ExternalSourceAspectIdentifier.AsObject,
        state?: ExternalSourceState.AsObject,
    }
}

export class DetectChangeResult extends jspb.Message { 

    hasElementid(): boolean;
    clearElementid(): void;
    getElementid(): string | undefined;
    setElementid(value: string): DetectChangeResult;

    hasExternalsourceaspectid(): boolean;
    clearExternalsourceaspectid(): void;
    getExternalsourceaspectid(): string | undefined;
    setExternalsourceaspectid(value: string): DetectChangeResult;

    hasIschanged(): boolean;
    clearIschanged(): void;
    getIschanged(): boolean | undefined;
    setIschanged(value: boolean): DetectChangeResult;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DetectChangeResult.AsObject;
    static toObject(includeInstance: boolean, msg: DetectChangeResult): DetectChangeResult.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DetectChangeResult, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DetectChangeResult;
    static deserializeBinaryFromReader(message: DetectChangeResult, reader: jspb.BinaryReader): DetectChangeResult;
}

export namespace DetectChangeResult {
    export type AsObject = {
        elementid?: string,
        externalsourceaspectid?: string,
        ischanged?: boolean,
    }
}

export class ExecuteECSqlRequest extends jspb.Message { 
    getEcsqlstatement(): string;
    setEcsqlstatement(value: string): ExecuteECSqlRequest;
    getParams(): string;
    setParams(value: string): ExecuteECSqlRequest;
    getLimit(): number;
    setLimit(value: number): ExecuteECSqlRequest;
    getOffset(): number;
    setOffset(value: number): ExecuteECSqlRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecuteECSqlRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ExecuteECSqlRequest): ExecuteECSqlRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecuteECSqlRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecuteECSqlRequest;
    static deserializeBinaryFromReader(message: ExecuteECSqlRequest, reader: jspb.BinaryReader): ExecuteECSqlRequest;
}

export namespace ExecuteECSqlRequest {
    export type AsObject = {
        ecsqlstatement: string,
        params: string,
        limit: number,
        offset: number,
    }
}

export class ExecuteECSqlResult extends jspb.Message { 
    getStatus(): number;
    setStatus(value: number): ExecuteECSqlResult;
    getRowsjson(): string;
    setRowsjson(value: string): ExecuteECSqlResult;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecuteECSqlResult.AsObject;
    static toObject(includeInstance: boolean, msg: ExecuteECSqlResult): ExecuteECSqlResult.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecuteECSqlResult, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecuteECSqlResult;
    static deserializeBinaryFromReader(message: ExecuteECSqlResult, reader: jspb.BinaryReader): ExecuteECSqlResult;
}

export namespace ExecuteECSqlResult {
    export type AsObject = {
        status: number,
        rowsjson: string,
    }
}
