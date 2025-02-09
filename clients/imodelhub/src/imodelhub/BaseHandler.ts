/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module iModelHubClient
 */
import { AccessToken } from "@itwin/core-bentley";
import { FileHandler, RequestGlobalOptions, RequestOptions, RequestQueryOptions } from "@bentley/itwin-client";
import { ChunkedQueryContext } from "../wsg/ChunkedQueryContext";
import { WsgInstance } from "../wsg/ECJsonTypeMap";
import { DefaultWsgRequestOptionsProvider, HttpRequestOptions, WsgClient, WsgRequestOptions } from "../wsg/WsgClient";
import { CustomRequestOptions } from "./CustomRequestOptions";
import { IModelHubError } from "./Errors";

const applicationVersionHeaderName = "Application-Version";

/**
 * Provides default options for iModelHub requests.
 */
class DefaultIModelHubRequestOptionsProvider extends DefaultWsgRequestOptionsProvider {
  public constructor(agent: any) {
    super();
    this._defaultOptions.errorCallback = IModelHubError.parse;
    this._defaultOptions.retryCallback = IModelHubError.shouldRetry;
    this._defaultOptions.agent = agent;
  }
}

/**
 * This type allows modifying HttpRequestOptions that are sent for every request.
 * @internal
 */
export type HttpRequestOptionsTransformer = (options: HttpRequestOptions) => void;

/**
 * This function when used on IModelClient adds specified header to every request.
 * @internal
 */
export function addHeader(name: string, valueFactory: () => string): HttpRequestOptionsTransformer {
  return (options: HttpRequestOptions) => {
    if (!options.headers)
      options.headers = {};
    options.headers[name] = valueFactory();
  };
}

/**
 * This function when used on IModelClient adds specified application version header to every request.
 * @internal
 */
export function addApplicationVersion(version: string) {
  return addHeader(applicationVersionHeaderName, () => version);
}

/**
 * This function when used on IModelClient adds CSRF header to every request.
 * @internal
 */
export function addCsrfHeader(headerName: string = "X-XSRF-TOKEN", cookieName: string = "XSRF-TOKEN"): HttpRequestOptionsTransformer {
  return addHeader(headerName, () => {
    return document.cookie.split("; ").find((r) => r.startsWith(`${cookieName}=`))!.split("=")[1];
  });
}

/**
 * This class acts as the WsgClient for other iModelHub Handlers.
 * @internal
 */
export class IModelBaseHandler extends WsgClient {
  protected override _url?: string;
  private _defaultIModelHubOptionsProvider: DefaultIModelHubRequestOptionsProvider;
  protected _agent: any;
  protected _fileHandler: FileHandler | undefined;
  private _customRequestOptions: CustomRequestOptions = new CustomRequestOptions();
  private _httpRequestOptionsTransformers: HttpRequestOptionsTransformer[] = [];

  /**
   * Create an instance of IModelBaseHandler.
   * @internal
   */
  public constructor(keepAliveDuration = 30000, fileHandler?: FileHandler) {
    super("sv1.1");
    this.baseUrl = "https://api.bentley.com/imodelhub";
    this._fileHandler = fileHandler;
    const agentOptions = { keepAlive: keepAliveDuration > 0, keepAliveMsecs: keepAliveDuration, secureProtocol: "TLSv1_2_method" };
    if (RequestGlobalOptions.httpsProxy) {
      this._agent = RequestGlobalOptions.createHttpsProxy(agentOptions);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this._agent = require("https").Agent(agentOptions);
    }
  }

  /**
   * @internal
   */
  public formatITwinIdForUrl(iTwinId: string) { return iTwinId; }

  /**
   * @internal
   */
  public getFileHandler(): FileHandler | undefined { return this._fileHandler; }

  /**
   * Augment request options with defaults returned by the DefaultIModelHubRequestOptionsProvider. Note that the options passed in by clients override any defaults where necessary.
   * @param options Options the caller wants to augment with the defaults.
   * @returns Promise resolves after the defaults are setup.
   * @internal
   */
  protected override async setupOptionDefaults(options: RequestOptions): Promise<void> {
    if (!this._defaultIModelHubOptionsProvider)
      this._defaultIModelHubOptionsProvider = new DefaultIModelHubRequestOptionsProvider(this._agent);

    return this._defaultIModelHubOptionsProvider.assignOptions(options);
  }

  /**
   * Populates HTTP request options with additional data.
   * @param options Options that need to be populated.
   * @returns Options populated with additional data.
   * @internal
   */
  protected setupHttpOptions(options?: HttpRequestOptions): HttpRequestOptions {
    const httpOptions: HttpRequestOptions = { ...options };

    for (const transformer of this._httpRequestOptionsTransformers) {
      transformer(httpOptions);
    }

    return httpOptions;
  }

  /**
   * Adds a method that will be called for every request to modify HttpRequestOptions.
   * @param func Method that will be used to modify HttpRequestOptions.
   * @internal
   */
  public use(func: HttpRequestOptionsTransformer) {
    this._httpRequestOptionsTransformers.push(func);
  }

  /**
   * Get the agent used for imodelhub connection pooling.
   * @returns The agent used for imodelhub connection pooling.
   * @internal
   */
  public getAgent(): any {
    return this._agent;
  }

  /**
   * Get the URL of the service. This method attempts to discover and cache the URL from the URL Discovery Service. If not found uses the default URL provided by client implementations. Note that for consistency sake, the URL is stripped of any trailing "/"
   * @returns URL for the service
   * @internal
   */
  public override async getUrl(): Promise<string> {
    return super.getUrl();
  }

  /**
   * Send a delete request. Sends a request without body.
   * @param relativeUrlPath Relative path to the REST resource.
   * @param httpRequestOptions Additional options for the HTTP request.
   * @returns Promise resolves after successfully deleting REST resource at the specified path.
   */
  public override async delete(accessToken: AccessToken, relativeUrlPath: string, httpRequestOptions?: HttpRequestOptions): Promise<void> {
    return super.delete(accessToken, relativeUrlPath, httpRequestOptions);
  }

  /**
   * Delete a strongly typed instance. Sends a request body with a WSG instance.
   * @param relativeUrlPath Relative path to the REST resource.
   * @param instance Instance to be deleted.
   * @param requestOptions WSG options for the request.
   * @returns Promise resolves after successfully deleting instance.
   */
  public override async deleteInstance<T extends WsgInstance>(accessToken: AccessToken, relativeUrlPath: string, instance?: T, requestOptions?: WsgRequestOptions): Promise<void> {
    if (this._customRequestOptions.isSet) {
      if (!requestOptions) {
        requestOptions = {};
      }
      requestOptions.CustomOptions = this._customRequestOptions.insertCustomOptions(requestOptions.CustomOptions);
    }
    return super.deleteInstance<T>(accessToken, relativeUrlPath, instance, requestOptions);
  }

  /**
   * Post a strongly typed instance. Sends a request body with a WSG instance.
   * @param typedConstructor Used to construct the resulting instances from the response.
   * @param relativeUrlPath Relative path to the REST resource.
   * @param instance Strongly typed instance to be posted.
   * @param requestOptions WSG options for the request.
   * @param httpRequestOptions Additional options for the HTTP request.
   * @returns The posted instance that's returned back from the server.
   */
  public override async postInstance<T extends WsgInstance>(accessToken: AccessToken, typedConstructor: new () => T, relativeUrlPath: string, instance: T, requestOptions?: WsgRequestOptions, httpRequestOptions?: HttpRequestOptions): Promise<T> {
    if (this._customRequestOptions.isSet) {
      if (!requestOptions) {
        requestOptions = {};
      }
      requestOptions.CustomOptions = this._customRequestOptions.insertCustomOptions(requestOptions.CustomOptions);
    }
    return super.postInstance<T>(accessToken, typedConstructor, relativeUrlPath, instance, requestOptions, this.setupHttpOptions(httpRequestOptions));
  }

  /**
   * Post multiple strongly typed instances. Sends a request body with WSG instances.
   * @param typedConstructor Used to construct the resulting instances from the response.
   * @param relativeUrlPath Relative path to the REST resource.
   * @param instances Strongly typed instances to be posted.
   * @param requestOptions WSG options for the request.
   * @param httpRequestOptions Additional options for the HTTP request.
   * @returns The posted instances that's returned back from the server.
   */
  public override async postInstances<T extends WsgInstance>(accessToken: AccessToken, typedConstructor: new () => T, relativeUrlPath: string, instances: T[], requestOptions?: WsgRequestOptions, httpRequestOptions?: HttpRequestOptions): Promise<T[]> {
    return super.postInstances(accessToken, typedConstructor, relativeUrlPath, instances, requestOptions, this.setupHttpOptions(httpRequestOptions));
  }

  /**
   * Get multiple strongly typed instances.
   * @param typedConstructor Used to construct the resulting instances from the response.
   * @param relativeUrlPath Relative path to the REST resource.
   * @param queryOptions Query options.
   * @param httpRequestOptions Additional options for the HTTP request.
   * @returns Array of strongly typed instances.
   */
  public override async getInstances<T extends WsgInstance>(accessToken: AccessToken, typedConstructor: new () => T, relativeUrlPath: string, queryOptions?: RequestQueryOptions, httpRequestOptions?: HttpRequestOptions): Promise<T[]> {
    return super.getInstances(accessToken, typedConstructor, relativeUrlPath, queryOptions, this.setupHttpOptions(httpRequestOptions));
  }

  /**
   * Get a chunk of strongly typed instances.
   * @param url Full path to the REST resource.
   * @param chunkedQueryContext Chunked query context
   * @param typedConstructor Constructor function for the type
   * @param queryOptions Query options.
   * @param httpRequestOptions Additional options for the HTTP request.
   * @returns Array of strongly typed instances.
   */
  public override async getInstancesChunk<T extends WsgInstance>(accessToken: AccessToken, url: string, chunkedQueryContext: ChunkedQueryContext | undefined, typedConstructor: new () => T, queryOptions?: RequestQueryOptions, httpRequestOptions?: HttpRequestOptions): Promise<T[]> {
    return super.getInstancesChunk(accessToken, url, chunkedQueryContext, typedConstructor, queryOptions, this.setupHttpOptions(httpRequestOptions));
  }

  /**
   * Get multiple strongly typed instances. Sends query in the request's body. This can be used for queries that are too long to fit in URL.
   * @param typedConstructor Used to construct the resulting instances from the response.
   * @param relativeUrlPath Relative path to the REST resource.
   * @param queryOptions Query options.
   * @param httpRequestOptions Additional options for the HTTP request.
   * @returns Array of strongly typed instances.
   */
  public override async postQuery<T extends WsgInstance>(accessToken: AccessToken, typedConstructor: new () => T, relativeUrlPath: string, queryOptions: RequestQueryOptions, httpRequestOptions?: HttpRequestOptions): Promise<T[]> {
    return super.postQuery(accessToken, typedConstructor, relativeUrlPath, queryOptions, this.setupHttpOptions(httpRequestOptions));
  }

  /**
   * Get an instance of CustomRequestOptions, which can be used to set custom request parameters for all future requests made by this handler.
   * @internal
   */
  public getCustomRequestOptions(): CustomRequestOptions {
    return this._customRequestOptions;
  }
}
