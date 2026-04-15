
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Campaign
 * 
 */
export type Campaign = $Result.DefaultSelection<Prisma.$CampaignPayload>
/**
 * Model Event
 * 
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>
/**
 * Model Character
 * 
 */
export type Character = $Result.DefaultSelection<Prisma.$CharacterPayload>
/**
 * Model Location
 * 
 */
export type Location = $Result.DefaultSelection<Prisma.$LocationPayload>
/**
 * Model ObjectModel
 * 
 */
export type ObjectModel = $Result.DefaultSelection<Prisma.$ObjectModelPayload>
/**
 * Model Relation
 * 
 */
export type Relation = $Result.DefaultSelection<Prisma.$RelationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  GM: 'GM',
  PLAYER: 'PLAYER'
};

export type Role = (typeof Role)[keyof typeof Role]


export const NodeType: {
  EVENT: 'EVENT',
  CHARACTER: 'CHARACTER',
  LOCATION: 'LOCATION',
  OBJECT: 'OBJECT'
};

export type NodeType = (typeof NodeType)[keyof typeof NodeType]


export const RelationType: {
  APPEARS: 'APPEARS',
  OCCURS_AT: 'OCCURS_AT',
  USES: 'USES',
  HAS: 'HAS',
  PARALLEL: 'PARALLEL',
  PREVIOUS: 'PREVIOUS',
  NEXT: 'NEXT',
  LINK: 'LINK'
};

export type RelationType = (typeof RelationType)[keyof typeof RelationType]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type NodeType = $Enums.NodeType

export const NodeType: typeof $Enums.NodeType

export type RelationType = $Enums.RelationType

export const RelationType: typeof $Enums.RelationType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.campaign`: Exposes CRUD operations for the **Campaign** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Campaigns
    * const campaigns = await prisma.campaign.findMany()
    * ```
    */
  get campaign(): Prisma.CampaignDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.character`: Exposes CRUD operations for the **Character** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Characters
    * const characters = await prisma.character.findMany()
    * ```
    */
  get character(): Prisma.CharacterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.location`: Exposes CRUD operations for the **Location** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Locations
    * const locations = await prisma.location.findMany()
    * ```
    */
  get location(): Prisma.LocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.objectModel`: Exposes CRUD operations for the **ObjectModel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ObjectModels
    * const objectModels = await prisma.objectModel.findMany()
    * ```
    */
  get objectModel(): Prisma.ObjectModelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.relation`: Exposes CRUD operations for the **Relation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Relations
    * const relations = await prisma.relation.findMany()
    * ```
    */
  get relation(): Prisma.RelationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Campaign: 'Campaign',
    Event: 'Event',
    Character: 'Character',
    Location: 'Location',
    ObjectModel: 'ObjectModel',
    Relation: 'Relation'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "campaign" | "event" | "character" | "location" | "objectModel" | "relation"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Campaign: {
        payload: Prisma.$CampaignPayload<ExtArgs>
        fields: Prisma.CampaignFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CampaignFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CampaignFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          findFirst: {
            args: Prisma.CampaignFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CampaignFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          findMany: {
            args: Prisma.CampaignFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>[]
          }
          create: {
            args: Prisma.CampaignCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          createMany: {
            args: Prisma.CampaignCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CampaignCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>[]
          }
          delete: {
            args: Prisma.CampaignDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          update: {
            args: Prisma.CampaignUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          deleteMany: {
            args: Prisma.CampaignDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CampaignUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CampaignUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>[]
          }
          upsert: {
            args: Prisma.CampaignUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          aggregate: {
            args: Prisma.CampaignAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCampaign>
          }
          groupBy: {
            args: Prisma.CampaignGroupByArgs<ExtArgs>
            result: $Utils.Optional<CampaignGroupByOutputType>[]
          }
          count: {
            args: Prisma.CampaignCountArgs<ExtArgs>
            result: $Utils.Optional<CampaignCountAggregateOutputType> | number
          }
        }
      }
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>
        fields: Prisma.EventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      Character: {
        payload: Prisma.$CharacterPayload<ExtArgs>
        fields: Prisma.CharacterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CharacterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CharacterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CharacterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CharacterPayload>
          }
          findFirst: {
            args: Prisma.CharacterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CharacterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CharacterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CharacterPayload>
          }
          findMany: {
            args: Prisma.CharacterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CharacterPayload>[]
          }
          create: {
            args: Prisma.CharacterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CharacterPayload>
          }
          createMany: {
            args: Prisma.CharacterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CharacterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CharacterPayload>[]
          }
          delete: {
            args: Prisma.CharacterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CharacterPayload>
          }
          update: {
            args: Prisma.CharacterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CharacterPayload>
          }
          deleteMany: {
            args: Prisma.CharacterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CharacterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CharacterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CharacterPayload>[]
          }
          upsert: {
            args: Prisma.CharacterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CharacterPayload>
          }
          aggregate: {
            args: Prisma.CharacterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCharacter>
          }
          groupBy: {
            args: Prisma.CharacterGroupByArgs<ExtArgs>
            result: $Utils.Optional<CharacterGroupByOutputType>[]
          }
          count: {
            args: Prisma.CharacterCountArgs<ExtArgs>
            result: $Utils.Optional<CharacterCountAggregateOutputType> | number
          }
        }
      }
      Location: {
        payload: Prisma.$LocationPayload<ExtArgs>
        fields: Prisma.LocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findFirst: {
            args: Prisma.LocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findMany: {
            args: Prisma.LocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          create: {
            args: Prisma.LocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          createMany: {
            args: Prisma.LocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          delete: {
            args: Prisma.LocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          update: {
            args: Prisma.LocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          deleteMany: {
            args: Prisma.LocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          upsert: {
            args: Prisma.LocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          aggregate: {
            args: Prisma.LocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocation>
          }
          groupBy: {
            args: Prisma.LocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationCountArgs<ExtArgs>
            result: $Utils.Optional<LocationCountAggregateOutputType> | number
          }
        }
      }
      ObjectModel: {
        payload: Prisma.$ObjectModelPayload<ExtArgs>
        fields: Prisma.ObjectModelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ObjectModelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectModelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ObjectModelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectModelPayload>
          }
          findFirst: {
            args: Prisma.ObjectModelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectModelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ObjectModelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectModelPayload>
          }
          findMany: {
            args: Prisma.ObjectModelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectModelPayload>[]
          }
          create: {
            args: Prisma.ObjectModelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectModelPayload>
          }
          createMany: {
            args: Prisma.ObjectModelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ObjectModelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectModelPayload>[]
          }
          delete: {
            args: Prisma.ObjectModelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectModelPayload>
          }
          update: {
            args: Prisma.ObjectModelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectModelPayload>
          }
          deleteMany: {
            args: Prisma.ObjectModelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ObjectModelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ObjectModelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectModelPayload>[]
          }
          upsert: {
            args: Prisma.ObjectModelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectModelPayload>
          }
          aggregate: {
            args: Prisma.ObjectModelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateObjectModel>
          }
          groupBy: {
            args: Prisma.ObjectModelGroupByArgs<ExtArgs>
            result: $Utils.Optional<ObjectModelGroupByOutputType>[]
          }
          count: {
            args: Prisma.ObjectModelCountArgs<ExtArgs>
            result: $Utils.Optional<ObjectModelCountAggregateOutputType> | number
          }
        }
      }
      Relation: {
        payload: Prisma.$RelationPayload<ExtArgs>
        fields: Prisma.RelationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RelationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RelationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationPayload>
          }
          findFirst: {
            args: Prisma.RelationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RelationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationPayload>
          }
          findMany: {
            args: Prisma.RelationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationPayload>[]
          }
          create: {
            args: Prisma.RelationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationPayload>
          }
          createMany: {
            args: Prisma.RelationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RelationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationPayload>[]
          }
          delete: {
            args: Prisma.RelationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationPayload>
          }
          update: {
            args: Prisma.RelationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationPayload>
          }
          deleteMany: {
            args: Prisma.RelationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RelationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RelationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationPayload>[]
          }
          upsert: {
            args: Prisma.RelationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationPayload>
          }
          aggregate: {
            args: Prisma.RelationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRelation>
          }
          groupBy: {
            args: Prisma.RelationGroupByArgs<ExtArgs>
            result: $Utils.Optional<RelationGroupByOutputType>[]
          }
          count: {
            args: Prisma.RelationCountArgs<ExtArgs>
            result: $Utils.Optional<RelationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    campaign?: CampaignOmit
    event?: EventOmit
    character?: CharacterOmit
    location?: LocationOmit
    objectModel?: ObjectModelOmit
    relation?: RelationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    campaigns: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaigns?: boolean | UserCountOutputTypeCountCampaignsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCampaignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CampaignWhereInput
  }


  /**
   * Count Type CampaignCountOutputType
   */

  export type CampaignCountOutputType = {
    characters: number
    events: number
    locations: number
    objects: number
  }

  export type CampaignCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    characters?: boolean | CampaignCountOutputTypeCountCharactersArgs
    events?: boolean | CampaignCountOutputTypeCountEventsArgs
    locations?: boolean | CampaignCountOutputTypeCountLocationsArgs
    objects?: boolean | CampaignCountOutputTypeCountObjectsArgs
  }

  // Custom InputTypes
  /**
   * CampaignCountOutputType without action
   */
  export type CampaignCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignCountOutputType
     */
    select?: CampaignCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CampaignCountOutputType without action
   */
  export type CampaignCountOutputTypeCountCharactersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CharacterWhereInput
  }

  /**
   * CampaignCountOutputType without action
   */
  export type CampaignCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
  }

  /**
   * CampaignCountOutputType without action
   */
  export type CampaignCountOutputTypeCountLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
  }

  /**
   * CampaignCountOutputType without action
   */
  export type CampaignCountOutputTypeCountObjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObjectModelWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    campaigns?: boolean | User$campaignsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaigns?: boolean | User$campaignsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      campaigns: Prisma.$CampaignPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      role: $Enums.Role
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    campaigns<T extends User$campaignsArgs<ExtArgs> = {}>(args?: Subset<T, User$campaignsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.campaigns
   */
  export type User$campaignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    where?: CampaignWhereInput
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    cursor?: CampaignWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Campaign
   */

  export type AggregateCampaign = {
    _count: CampaignCountAggregateOutputType | null
    _min: CampaignMinAggregateOutputType | null
    _max: CampaignMaxAggregateOutputType | null
  }

  export type CampaignMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    description: string | null
    imageUrl: string | null
  }

  export type CampaignMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    description: string | null
    imageUrl: string | null
  }

  export type CampaignCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    description: number
    imageUrl: number
    _all: number
  }


  export type CampaignMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    imageUrl?: true
  }

  export type CampaignMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    imageUrl?: true
  }

  export type CampaignCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    imageUrl?: true
    _all?: true
  }

  export type CampaignAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Campaign to aggregate.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Campaigns
    **/
    _count?: true | CampaignCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CampaignMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CampaignMaxAggregateInputType
  }

  export type GetCampaignAggregateType<T extends CampaignAggregateArgs> = {
        [P in keyof T & keyof AggregateCampaign]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCampaign[P]>
      : GetScalarType<T[P], AggregateCampaign[P]>
  }




  export type CampaignGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CampaignWhereInput
    orderBy?: CampaignOrderByWithAggregationInput | CampaignOrderByWithAggregationInput[]
    by: CampaignScalarFieldEnum[] | CampaignScalarFieldEnum
    having?: CampaignScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CampaignCountAggregateInputType | true
    _min?: CampaignMinAggregateInputType
    _max?: CampaignMaxAggregateInputType
  }

  export type CampaignGroupByOutputType = {
    id: string
    userId: string
    name: string
    description: string | null
    imageUrl: string | null
    _count: CampaignCountAggregateOutputType | null
    _min: CampaignMinAggregateOutputType | null
    _max: CampaignMaxAggregateOutputType | null
  }

  type GetCampaignGroupByPayload<T extends CampaignGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CampaignGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CampaignGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CampaignGroupByOutputType[P]>
            : GetScalarType<T[P], CampaignGroupByOutputType[P]>
        }
      >
    >


  export type CampaignSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    imageUrl?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    characters?: boolean | Campaign$charactersArgs<ExtArgs>
    events?: boolean | Campaign$eventsArgs<ExtArgs>
    locations?: boolean | Campaign$locationsArgs<ExtArgs>
    objects?: boolean | Campaign$objectsArgs<ExtArgs>
    _count?: boolean | CampaignCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["campaign"]>

  export type CampaignSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    imageUrl?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["campaign"]>

  export type CampaignSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    imageUrl?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["campaign"]>

  export type CampaignSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    imageUrl?: boolean
  }

  export type CampaignOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "description" | "imageUrl", ExtArgs["result"]["campaign"]>
  export type CampaignInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    characters?: boolean | Campaign$charactersArgs<ExtArgs>
    events?: boolean | Campaign$eventsArgs<ExtArgs>
    locations?: boolean | Campaign$locationsArgs<ExtArgs>
    objects?: boolean | Campaign$objectsArgs<ExtArgs>
    _count?: boolean | CampaignCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CampaignIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CampaignIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CampaignPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Campaign"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      characters: Prisma.$CharacterPayload<ExtArgs>[]
      events: Prisma.$EventPayload<ExtArgs>[]
      locations: Prisma.$LocationPayload<ExtArgs>[]
      objects: Prisma.$ObjectModelPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      description: string | null
      imageUrl: string | null
    }, ExtArgs["result"]["campaign"]>
    composites: {}
  }

  type CampaignGetPayload<S extends boolean | null | undefined | CampaignDefaultArgs> = $Result.GetResult<Prisma.$CampaignPayload, S>

  type CampaignCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CampaignFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CampaignCountAggregateInputType | true
    }

  export interface CampaignDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Campaign'], meta: { name: 'Campaign' } }
    /**
     * Find zero or one Campaign that matches the filter.
     * @param {CampaignFindUniqueArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CampaignFindUniqueArgs>(args: SelectSubset<T, CampaignFindUniqueArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Campaign that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CampaignFindUniqueOrThrowArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CampaignFindUniqueOrThrowArgs>(args: SelectSubset<T, CampaignFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Campaign that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignFindFirstArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CampaignFindFirstArgs>(args?: SelectSubset<T, CampaignFindFirstArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Campaign that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignFindFirstOrThrowArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CampaignFindFirstOrThrowArgs>(args?: SelectSubset<T, CampaignFindFirstOrThrowArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Campaigns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Campaigns
     * const campaigns = await prisma.campaign.findMany()
     * 
     * // Get first 10 Campaigns
     * const campaigns = await prisma.campaign.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const campaignWithIdOnly = await prisma.campaign.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CampaignFindManyArgs>(args?: SelectSubset<T, CampaignFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Campaign.
     * @param {CampaignCreateArgs} args - Arguments to create a Campaign.
     * @example
     * // Create one Campaign
     * const Campaign = await prisma.campaign.create({
     *   data: {
     *     // ... data to create a Campaign
     *   }
     * })
     * 
     */
    create<T extends CampaignCreateArgs>(args: SelectSubset<T, CampaignCreateArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Campaigns.
     * @param {CampaignCreateManyArgs} args - Arguments to create many Campaigns.
     * @example
     * // Create many Campaigns
     * const campaign = await prisma.campaign.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CampaignCreateManyArgs>(args?: SelectSubset<T, CampaignCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Campaigns and returns the data saved in the database.
     * @param {CampaignCreateManyAndReturnArgs} args - Arguments to create many Campaigns.
     * @example
     * // Create many Campaigns
     * const campaign = await prisma.campaign.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Campaigns and only return the `id`
     * const campaignWithIdOnly = await prisma.campaign.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CampaignCreateManyAndReturnArgs>(args?: SelectSubset<T, CampaignCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Campaign.
     * @param {CampaignDeleteArgs} args - Arguments to delete one Campaign.
     * @example
     * // Delete one Campaign
     * const Campaign = await prisma.campaign.delete({
     *   where: {
     *     // ... filter to delete one Campaign
     *   }
     * })
     * 
     */
    delete<T extends CampaignDeleteArgs>(args: SelectSubset<T, CampaignDeleteArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Campaign.
     * @param {CampaignUpdateArgs} args - Arguments to update one Campaign.
     * @example
     * // Update one Campaign
     * const campaign = await prisma.campaign.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CampaignUpdateArgs>(args: SelectSubset<T, CampaignUpdateArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Campaigns.
     * @param {CampaignDeleteManyArgs} args - Arguments to filter Campaigns to delete.
     * @example
     * // Delete a few Campaigns
     * const { count } = await prisma.campaign.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CampaignDeleteManyArgs>(args?: SelectSubset<T, CampaignDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Campaigns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Campaigns
     * const campaign = await prisma.campaign.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CampaignUpdateManyArgs>(args: SelectSubset<T, CampaignUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Campaigns and returns the data updated in the database.
     * @param {CampaignUpdateManyAndReturnArgs} args - Arguments to update many Campaigns.
     * @example
     * // Update many Campaigns
     * const campaign = await prisma.campaign.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Campaigns and only return the `id`
     * const campaignWithIdOnly = await prisma.campaign.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CampaignUpdateManyAndReturnArgs>(args: SelectSubset<T, CampaignUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Campaign.
     * @param {CampaignUpsertArgs} args - Arguments to update or create a Campaign.
     * @example
     * // Update or create a Campaign
     * const campaign = await prisma.campaign.upsert({
     *   create: {
     *     // ... data to create a Campaign
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Campaign we want to update
     *   }
     * })
     */
    upsert<T extends CampaignUpsertArgs>(args: SelectSubset<T, CampaignUpsertArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Campaigns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignCountArgs} args - Arguments to filter Campaigns to count.
     * @example
     * // Count the number of Campaigns
     * const count = await prisma.campaign.count({
     *   where: {
     *     // ... the filter for the Campaigns we want to count
     *   }
     * })
    **/
    count<T extends CampaignCountArgs>(
      args?: Subset<T, CampaignCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CampaignCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Campaign.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CampaignAggregateArgs>(args: Subset<T, CampaignAggregateArgs>): Prisma.PrismaPromise<GetCampaignAggregateType<T>>

    /**
     * Group by Campaign.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CampaignGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CampaignGroupByArgs['orderBy'] }
        : { orderBy?: CampaignGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CampaignGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCampaignGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Campaign model
   */
  readonly fields: CampaignFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Campaign.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CampaignClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    characters<T extends Campaign$charactersArgs<ExtArgs> = {}>(args?: Subset<T, Campaign$charactersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    events<T extends Campaign$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Campaign$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    locations<T extends Campaign$locationsArgs<ExtArgs> = {}>(args?: Subset<T, Campaign$locationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    objects<T extends Campaign$objectsArgs<ExtArgs> = {}>(args?: Subset<T, Campaign$objectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjectModelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Campaign model
   */
  interface CampaignFieldRefs {
    readonly id: FieldRef<"Campaign", 'String'>
    readonly userId: FieldRef<"Campaign", 'String'>
    readonly name: FieldRef<"Campaign", 'String'>
    readonly description: FieldRef<"Campaign", 'String'>
    readonly imageUrl: FieldRef<"Campaign", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Campaign findUnique
   */
  export type CampaignFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign findUniqueOrThrow
   */
  export type CampaignFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign findFirst
   */
  export type CampaignFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Campaigns.
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Campaigns.
     */
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Campaign findFirstOrThrow
   */
  export type CampaignFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Campaigns.
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Campaigns.
     */
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Campaign findMany
   */
  export type CampaignFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * Filter, which Campaigns to fetch.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Campaigns.
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Campaigns.
     */
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Campaign create
   */
  export type CampaignCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * The data needed to create a Campaign.
     */
    data: XOR<CampaignCreateInput, CampaignUncheckedCreateInput>
  }

  /**
   * Campaign createMany
   */
  export type CampaignCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Campaigns.
     */
    data: CampaignCreateManyInput | CampaignCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Campaign createManyAndReturn
   */
  export type CampaignCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * The data used to create many Campaigns.
     */
    data: CampaignCreateManyInput | CampaignCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Campaign update
   */
  export type CampaignUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * The data needed to update a Campaign.
     */
    data: XOR<CampaignUpdateInput, CampaignUncheckedUpdateInput>
    /**
     * Choose, which Campaign to update.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign updateMany
   */
  export type CampaignUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Campaigns.
     */
    data: XOR<CampaignUpdateManyMutationInput, CampaignUncheckedUpdateManyInput>
    /**
     * Filter which Campaigns to update
     */
    where?: CampaignWhereInput
    /**
     * Limit how many Campaigns to update.
     */
    limit?: number
  }

  /**
   * Campaign updateManyAndReturn
   */
  export type CampaignUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * The data used to update Campaigns.
     */
    data: XOR<CampaignUpdateManyMutationInput, CampaignUncheckedUpdateManyInput>
    /**
     * Filter which Campaigns to update
     */
    where?: CampaignWhereInput
    /**
     * Limit how many Campaigns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Campaign upsert
   */
  export type CampaignUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * The filter to search for the Campaign to update in case it exists.
     */
    where: CampaignWhereUniqueInput
    /**
     * In case the Campaign found by the `where` argument doesn't exist, create a new Campaign with this data.
     */
    create: XOR<CampaignCreateInput, CampaignUncheckedCreateInput>
    /**
     * In case the Campaign was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CampaignUpdateInput, CampaignUncheckedUpdateInput>
  }

  /**
   * Campaign delete
   */
  export type CampaignDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * Filter which Campaign to delete.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign deleteMany
   */
  export type CampaignDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Campaigns to delete
     */
    where?: CampaignWhereInput
    /**
     * Limit how many Campaigns to delete.
     */
    limit?: number
  }

  /**
   * Campaign.characters
   */
  export type Campaign$charactersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterInclude<ExtArgs> | null
    where?: CharacterWhereInput
    orderBy?: CharacterOrderByWithRelationInput | CharacterOrderByWithRelationInput[]
    cursor?: CharacterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CharacterScalarFieldEnum | CharacterScalarFieldEnum[]
  }

  /**
   * Campaign.events
   */
  export type Campaign$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    where?: EventWhereInput
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    cursor?: EventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Campaign.locations
   */
  export type Campaign$locationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    cursor?: LocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Campaign.objects
   */
  export type Campaign$objectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelInclude<ExtArgs> | null
    where?: ObjectModelWhereInput
    orderBy?: ObjectModelOrderByWithRelationInput | ObjectModelOrderByWithRelationInput[]
    cursor?: ObjectModelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ObjectModelScalarFieldEnum | ObjectModelScalarFieldEnum[]
  }

  /**
   * Campaign without action
   */
  export type CampaignDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
  }


  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventMinAggregateOutputType = {
    id: string | null
    campaignId: string | null
    title: string | null
    description: string | null
    createdAt: Date | null
    imageUrl: string | null
  }

  export type EventMaxAggregateOutputType = {
    id: string | null
    campaignId: string | null
    title: string | null
    description: string | null
    createdAt: Date | null
    imageUrl: string | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    campaignId: number
    title: number
    description: number
    createdAt: number
    imageUrl: number
    _all: number
  }


  export type EventMinAggregateInputType = {
    id?: true
    campaignId?: true
    title?: true
    description?: true
    createdAt?: true
    imageUrl?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    campaignId?: true
    title?: true
    description?: true
    createdAt?: true
    imageUrl?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    campaignId?: true
    title?: true
    description?: true
    createdAt?: true
    imageUrl?: true
    _all?: true
  }

  export type EventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
    orderBy?: EventOrderByWithAggregationInput | EventOrderByWithAggregationInput[]
    by: EventScalarFieldEnum[] | EventScalarFieldEnum
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }

  export type EventGroupByOutputType = {
    id: string
    campaignId: string
    title: string
    description: string | null
    createdAt: Date
    imageUrl: string | null
    _count: EventCountAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectScalar = {
    id?: boolean
    campaignId?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
  }

  export type EventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "campaignId" | "title" | "description" | "createdAt" | "imageUrl", ExtArgs["result"]["event"]>
  export type EventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }
  export type EventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }
  export type EventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }

  export type $EventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Event"
    objects: {
      campaign: Prisma.$CampaignPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      campaignId: string
      title: string
      description: string | null
      createdAt: Date
      imageUrl: string | null
    }, ExtArgs["result"]["event"]>
    composites: {}
  }

  type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = $Result.GetResult<Prisma.$EventPayload, S>

  type EventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface EventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Event'], meta: { name: 'Event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventFindManyArgs>(args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
     */
    create<T extends EventCreateArgs>(args: SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventCreateManyArgs>(args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
     */
    delete<T extends EventDeleteArgs>(args: SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventUpdateArgs>(args: SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventDeleteManyArgs>(args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventUpdateManyArgs>(args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events and returns the data updated in the database.
     * @param {EventUpdateManyAndReturnArgs} args - Arguments to update many Events.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventUpdateManyAndReturnArgs>(args: SelectSubset<T, EventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(args: SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Event model
   */
  readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    campaign<T extends CampaignDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CampaignDefaultArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Event model
   */
  interface EventFieldRefs {
    readonly id: FieldRef<"Event", 'String'>
    readonly campaignId: FieldRef<"Event", 'String'>
    readonly title: FieldRef<"Event", 'String'>
    readonly description: FieldRef<"Event", 'String'>
    readonly createdAt: FieldRef<"Event", 'DateTime'>
    readonly imageUrl: FieldRef<"Event", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findMany
   */
  export type EventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event create
   */
  export type EventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Event update
   */
  export type EventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Event updateManyAndReturn
   */
  export type EventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Event upsert
   */
  export type EventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }

  /**
   * Event delete
   */
  export type EventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to delete.
     */
    limit?: number
  }

  /**
   * Event without action
   */
  export type EventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
  }


  /**
   * Model Character
   */

  export type AggregateCharacter = {
    _count: CharacterCountAggregateOutputType | null
    _min: CharacterMinAggregateOutputType | null
    _max: CharacterMaxAggregateOutputType | null
  }

  export type CharacterMinAggregateOutputType = {
    id: string | null
    campaignId: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    imageUrl: string | null
  }

  export type CharacterMaxAggregateOutputType = {
    id: string | null
    campaignId: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    imageUrl: string | null
  }

  export type CharacterCountAggregateOutputType = {
    id: number
    campaignId: number
    name: number
    description: number
    createdAt: number
    imageUrl: number
    _all: number
  }


  export type CharacterMinAggregateInputType = {
    id?: true
    campaignId?: true
    name?: true
    description?: true
    createdAt?: true
    imageUrl?: true
  }

  export type CharacterMaxAggregateInputType = {
    id?: true
    campaignId?: true
    name?: true
    description?: true
    createdAt?: true
    imageUrl?: true
  }

  export type CharacterCountAggregateInputType = {
    id?: true
    campaignId?: true
    name?: true
    description?: true
    createdAt?: true
    imageUrl?: true
    _all?: true
  }

  export type CharacterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Character to aggregate.
     */
    where?: CharacterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Characters to fetch.
     */
    orderBy?: CharacterOrderByWithRelationInput | CharacterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CharacterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Characters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Characters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Characters
    **/
    _count?: true | CharacterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CharacterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CharacterMaxAggregateInputType
  }

  export type GetCharacterAggregateType<T extends CharacterAggregateArgs> = {
        [P in keyof T & keyof AggregateCharacter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCharacter[P]>
      : GetScalarType<T[P], AggregateCharacter[P]>
  }




  export type CharacterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CharacterWhereInput
    orderBy?: CharacterOrderByWithAggregationInput | CharacterOrderByWithAggregationInput[]
    by: CharacterScalarFieldEnum[] | CharacterScalarFieldEnum
    having?: CharacterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CharacterCountAggregateInputType | true
    _min?: CharacterMinAggregateInputType
    _max?: CharacterMaxAggregateInputType
  }

  export type CharacterGroupByOutputType = {
    id: string
    campaignId: string
    name: string
    description: string | null
    createdAt: Date
    imageUrl: string | null
    _count: CharacterCountAggregateOutputType | null
    _min: CharacterMinAggregateOutputType | null
    _max: CharacterMaxAggregateOutputType | null
  }

  type GetCharacterGroupByPayload<T extends CharacterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CharacterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CharacterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CharacterGroupByOutputType[P]>
            : GetScalarType<T[P], CharacterGroupByOutputType[P]>
        }
      >
    >


  export type CharacterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["character"]>

  export type CharacterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["character"]>

  export type CharacterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["character"]>

  export type CharacterSelectScalar = {
    id?: boolean
    campaignId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
  }

  export type CharacterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "campaignId" | "name" | "description" | "createdAt" | "imageUrl", ExtArgs["result"]["character"]>
  export type CharacterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }
  export type CharacterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }
  export type CharacterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }

  export type $CharacterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Character"
    objects: {
      campaign: Prisma.$CampaignPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      campaignId: string
      name: string
      description: string | null
      createdAt: Date
      imageUrl: string | null
    }, ExtArgs["result"]["character"]>
    composites: {}
  }

  type CharacterGetPayload<S extends boolean | null | undefined | CharacterDefaultArgs> = $Result.GetResult<Prisma.$CharacterPayload, S>

  type CharacterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CharacterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CharacterCountAggregateInputType | true
    }

  export interface CharacterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Character'], meta: { name: 'Character' } }
    /**
     * Find zero or one Character that matches the filter.
     * @param {CharacterFindUniqueArgs} args - Arguments to find a Character
     * @example
     * // Get one Character
     * const character = await prisma.character.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CharacterFindUniqueArgs>(args: SelectSubset<T, CharacterFindUniqueArgs<ExtArgs>>): Prisma__CharacterClient<$Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Character that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CharacterFindUniqueOrThrowArgs} args - Arguments to find a Character
     * @example
     * // Get one Character
     * const character = await prisma.character.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CharacterFindUniqueOrThrowArgs>(args: SelectSubset<T, CharacterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CharacterClient<$Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Character that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CharacterFindFirstArgs} args - Arguments to find a Character
     * @example
     * // Get one Character
     * const character = await prisma.character.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CharacterFindFirstArgs>(args?: SelectSubset<T, CharacterFindFirstArgs<ExtArgs>>): Prisma__CharacterClient<$Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Character that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CharacterFindFirstOrThrowArgs} args - Arguments to find a Character
     * @example
     * // Get one Character
     * const character = await prisma.character.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CharacterFindFirstOrThrowArgs>(args?: SelectSubset<T, CharacterFindFirstOrThrowArgs<ExtArgs>>): Prisma__CharacterClient<$Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Characters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CharacterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Characters
     * const characters = await prisma.character.findMany()
     * 
     * // Get first 10 Characters
     * const characters = await prisma.character.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const characterWithIdOnly = await prisma.character.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CharacterFindManyArgs>(args?: SelectSubset<T, CharacterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Character.
     * @param {CharacterCreateArgs} args - Arguments to create a Character.
     * @example
     * // Create one Character
     * const Character = await prisma.character.create({
     *   data: {
     *     // ... data to create a Character
     *   }
     * })
     * 
     */
    create<T extends CharacterCreateArgs>(args: SelectSubset<T, CharacterCreateArgs<ExtArgs>>): Prisma__CharacterClient<$Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Characters.
     * @param {CharacterCreateManyArgs} args - Arguments to create many Characters.
     * @example
     * // Create many Characters
     * const character = await prisma.character.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CharacterCreateManyArgs>(args?: SelectSubset<T, CharacterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Characters and returns the data saved in the database.
     * @param {CharacterCreateManyAndReturnArgs} args - Arguments to create many Characters.
     * @example
     * // Create many Characters
     * const character = await prisma.character.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Characters and only return the `id`
     * const characterWithIdOnly = await prisma.character.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CharacterCreateManyAndReturnArgs>(args?: SelectSubset<T, CharacterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Character.
     * @param {CharacterDeleteArgs} args - Arguments to delete one Character.
     * @example
     * // Delete one Character
     * const Character = await prisma.character.delete({
     *   where: {
     *     // ... filter to delete one Character
     *   }
     * })
     * 
     */
    delete<T extends CharacterDeleteArgs>(args: SelectSubset<T, CharacterDeleteArgs<ExtArgs>>): Prisma__CharacterClient<$Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Character.
     * @param {CharacterUpdateArgs} args - Arguments to update one Character.
     * @example
     * // Update one Character
     * const character = await prisma.character.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CharacterUpdateArgs>(args: SelectSubset<T, CharacterUpdateArgs<ExtArgs>>): Prisma__CharacterClient<$Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Characters.
     * @param {CharacterDeleteManyArgs} args - Arguments to filter Characters to delete.
     * @example
     * // Delete a few Characters
     * const { count } = await prisma.character.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CharacterDeleteManyArgs>(args?: SelectSubset<T, CharacterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Characters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CharacterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Characters
     * const character = await prisma.character.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CharacterUpdateManyArgs>(args: SelectSubset<T, CharacterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Characters and returns the data updated in the database.
     * @param {CharacterUpdateManyAndReturnArgs} args - Arguments to update many Characters.
     * @example
     * // Update many Characters
     * const character = await prisma.character.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Characters and only return the `id`
     * const characterWithIdOnly = await prisma.character.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CharacterUpdateManyAndReturnArgs>(args: SelectSubset<T, CharacterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Character.
     * @param {CharacterUpsertArgs} args - Arguments to update or create a Character.
     * @example
     * // Update or create a Character
     * const character = await prisma.character.upsert({
     *   create: {
     *     // ... data to create a Character
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Character we want to update
     *   }
     * })
     */
    upsert<T extends CharacterUpsertArgs>(args: SelectSubset<T, CharacterUpsertArgs<ExtArgs>>): Prisma__CharacterClient<$Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Characters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CharacterCountArgs} args - Arguments to filter Characters to count.
     * @example
     * // Count the number of Characters
     * const count = await prisma.character.count({
     *   where: {
     *     // ... the filter for the Characters we want to count
     *   }
     * })
    **/
    count<T extends CharacterCountArgs>(
      args?: Subset<T, CharacterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CharacterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Character.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CharacterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CharacterAggregateArgs>(args: Subset<T, CharacterAggregateArgs>): Prisma.PrismaPromise<GetCharacterAggregateType<T>>

    /**
     * Group by Character.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CharacterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CharacterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CharacterGroupByArgs['orderBy'] }
        : { orderBy?: CharacterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CharacterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCharacterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Character model
   */
  readonly fields: CharacterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Character.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CharacterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    campaign<T extends CampaignDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CampaignDefaultArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Character model
   */
  interface CharacterFieldRefs {
    readonly id: FieldRef<"Character", 'String'>
    readonly campaignId: FieldRef<"Character", 'String'>
    readonly name: FieldRef<"Character", 'String'>
    readonly description: FieldRef<"Character", 'String'>
    readonly createdAt: FieldRef<"Character", 'DateTime'>
    readonly imageUrl: FieldRef<"Character", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Character findUnique
   */
  export type CharacterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterInclude<ExtArgs> | null
    /**
     * Filter, which Character to fetch.
     */
    where: CharacterWhereUniqueInput
  }

  /**
   * Character findUniqueOrThrow
   */
  export type CharacterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterInclude<ExtArgs> | null
    /**
     * Filter, which Character to fetch.
     */
    where: CharacterWhereUniqueInput
  }

  /**
   * Character findFirst
   */
  export type CharacterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterInclude<ExtArgs> | null
    /**
     * Filter, which Character to fetch.
     */
    where?: CharacterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Characters to fetch.
     */
    orderBy?: CharacterOrderByWithRelationInput | CharacterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Characters.
     */
    cursor?: CharacterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Characters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Characters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Characters.
     */
    distinct?: CharacterScalarFieldEnum | CharacterScalarFieldEnum[]
  }

  /**
   * Character findFirstOrThrow
   */
  export type CharacterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterInclude<ExtArgs> | null
    /**
     * Filter, which Character to fetch.
     */
    where?: CharacterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Characters to fetch.
     */
    orderBy?: CharacterOrderByWithRelationInput | CharacterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Characters.
     */
    cursor?: CharacterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Characters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Characters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Characters.
     */
    distinct?: CharacterScalarFieldEnum | CharacterScalarFieldEnum[]
  }

  /**
   * Character findMany
   */
  export type CharacterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterInclude<ExtArgs> | null
    /**
     * Filter, which Characters to fetch.
     */
    where?: CharacterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Characters to fetch.
     */
    orderBy?: CharacterOrderByWithRelationInput | CharacterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Characters.
     */
    cursor?: CharacterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Characters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Characters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Characters.
     */
    distinct?: CharacterScalarFieldEnum | CharacterScalarFieldEnum[]
  }

  /**
   * Character create
   */
  export type CharacterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterInclude<ExtArgs> | null
    /**
     * The data needed to create a Character.
     */
    data: XOR<CharacterCreateInput, CharacterUncheckedCreateInput>
  }

  /**
   * Character createMany
   */
  export type CharacterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Characters.
     */
    data: CharacterCreateManyInput | CharacterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Character createManyAndReturn
   */
  export type CharacterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * The data used to create many Characters.
     */
    data: CharacterCreateManyInput | CharacterCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Character update
   */
  export type CharacterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterInclude<ExtArgs> | null
    /**
     * The data needed to update a Character.
     */
    data: XOR<CharacterUpdateInput, CharacterUncheckedUpdateInput>
    /**
     * Choose, which Character to update.
     */
    where: CharacterWhereUniqueInput
  }

  /**
   * Character updateMany
   */
  export type CharacterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Characters.
     */
    data: XOR<CharacterUpdateManyMutationInput, CharacterUncheckedUpdateManyInput>
    /**
     * Filter which Characters to update
     */
    where?: CharacterWhereInput
    /**
     * Limit how many Characters to update.
     */
    limit?: number
  }

  /**
   * Character updateManyAndReturn
   */
  export type CharacterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * The data used to update Characters.
     */
    data: XOR<CharacterUpdateManyMutationInput, CharacterUncheckedUpdateManyInput>
    /**
     * Filter which Characters to update
     */
    where?: CharacterWhereInput
    /**
     * Limit how many Characters to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Character upsert
   */
  export type CharacterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterInclude<ExtArgs> | null
    /**
     * The filter to search for the Character to update in case it exists.
     */
    where: CharacterWhereUniqueInput
    /**
     * In case the Character found by the `where` argument doesn't exist, create a new Character with this data.
     */
    create: XOR<CharacterCreateInput, CharacterUncheckedCreateInput>
    /**
     * In case the Character was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CharacterUpdateInput, CharacterUncheckedUpdateInput>
  }

  /**
   * Character delete
   */
  export type CharacterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterInclude<ExtArgs> | null
    /**
     * Filter which Character to delete.
     */
    where: CharacterWhereUniqueInput
  }

  /**
   * Character deleteMany
   */
  export type CharacterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Characters to delete
     */
    where?: CharacterWhereInput
    /**
     * Limit how many Characters to delete.
     */
    limit?: number
  }

  /**
   * Character without action
   */
  export type CharacterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Character
     */
    select?: CharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Character
     */
    omit?: CharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CharacterInclude<ExtArgs> | null
  }


  /**
   * Model Location
   */

  export type AggregateLocation = {
    _count: LocationCountAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  export type LocationMinAggregateOutputType = {
    id: string | null
    campaignId: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    imageUrl: string | null
  }

  export type LocationMaxAggregateOutputType = {
    id: string | null
    campaignId: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    imageUrl: string | null
  }

  export type LocationCountAggregateOutputType = {
    id: number
    campaignId: number
    name: number
    description: number
    createdAt: number
    imageUrl: number
    _all: number
  }


  export type LocationMinAggregateInputType = {
    id?: true
    campaignId?: true
    name?: true
    description?: true
    createdAt?: true
    imageUrl?: true
  }

  export type LocationMaxAggregateInputType = {
    id?: true
    campaignId?: true
    name?: true
    description?: true
    createdAt?: true
    imageUrl?: true
  }

  export type LocationCountAggregateInputType = {
    id?: true
    campaignId?: true
    name?: true
    description?: true
    createdAt?: true
    imageUrl?: true
    _all?: true
  }

  export type LocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Location to aggregate.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Locations
    **/
    _count?: true | LocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationMaxAggregateInputType
  }

  export type GetLocationAggregateType<T extends LocationAggregateArgs> = {
        [P in keyof T & keyof AggregateLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocation[P]>
      : GetScalarType<T[P], AggregateLocation[P]>
  }




  export type LocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithAggregationInput | LocationOrderByWithAggregationInput[]
    by: LocationScalarFieldEnum[] | LocationScalarFieldEnum
    having?: LocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationCountAggregateInputType | true
    _min?: LocationMinAggregateInputType
    _max?: LocationMaxAggregateInputType
  }

  export type LocationGroupByOutputType = {
    id: string
    campaignId: string
    name: string
    description: string | null
    createdAt: Date
    imageUrl: string | null
    _count: LocationCountAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  type GetLocationGroupByPayload<T extends LocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationGroupByOutputType[P]>
            : GetScalarType<T[P], LocationGroupByOutputType[P]>
        }
      >
    >


  export type LocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>

  export type LocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>

  export type LocationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>

  export type LocationSelectScalar = {
    id?: boolean
    campaignId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
  }

  export type LocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "campaignId" | "name" | "description" | "createdAt" | "imageUrl", ExtArgs["result"]["location"]>
  export type LocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }
  export type LocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }
  export type LocationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }

  export type $LocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Location"
    objects: {
      campaign: Prisma.$CampaignPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      campaignId: string
      name: string
      description: string | null
      createdAt: Date
      imageUrl: string | null
    }, ExtArgs["result"]["location"]>
    composites: {}
  }

  type LocationGetPayload<S extends boolean | null | undefined | LocationDefaultArgs> = $Result.GetResult<Prisma.$LocationPayload, S>

  type LocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocationCountAggregateInputType | true
    }

  export interface LocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Location'], meta: { name: 'Location' } }
    /**
     * Find zero or one Location that matches the filter.
     * @param {LocationFindUniqueArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationFindUniqueArgs>(args: SelectSubset<T, LocationFindUniqueArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Location that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocationFindUniqueOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationFindFirstArgs>(args?: SelectSubset<T, LocationFindFirstArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Locations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Locations
     * const locations = await prisma.location.findMany()
     * 
     * // Get first 10 Locations
     * const locations = await prisma.location.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationWithIdOnly = await prisma.location.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationFindManyArgs>(args?: SelectSubset<T, LocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Location.
     * @param {LocationCreateArgs} args - Arguments to create a Location.
     * @example
     * // Create one Location
     * const Location = await prisma.location.create({
     *   data: {
     *     // ... data to create a Location
     *   }
     * })
     * 
     */
    create<T extends LocationCreateArgs>(args: SelectSubset<T, LocationCreateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Locations.
     * @param {LocationCreateManyArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationCreateManyArgs>(args?: SelectSubset<T, LocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Locations and returns the data saved in the database.
     * @param {LocationCreateManyAndReturnArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Locations and only return the `id`
     * const locationWithIdOnly = await prisma.location.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocationCreateManyAndReturnArgs>(args?: SelectSubset<T, LocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Location.
     * @param {LocationDeleteArgs} args - Arguments to delete one Location.
     * @example
     * // Delete one Location
     * const Location = await prisma.location.delete({
     *   where: {
     *     // ... filter to delete one Location
     *   }
     * })
     * 
     */
    delete<T extends LocationDeleteArgs>(args: SelectSubset<T, LocationDeleteArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Location.
     * @param {LocationUpdateArgs} args - Arguments to update one Location.
     * @example
     * // Update one Location
     * const location = await prisma.location.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationUpdateArgs>(args: SelectSubset<T, LocationUpdateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Locations.
     * @param {LocationDeleteManyArgs} args - Arguments to filter Locations to delete.
     * @example
     * // Delete a few Locations
     * const { count } = await prisma.location.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationDeleteManyArgs>(args?: SelectSubset<T, LocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationUpdateManyArgs>(args: SelectSubset<T, LocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations and returns the data updated in the database.
     * @param {LocationUpdateManyAndReturnArgs} args - Arguments to update many Locations.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Locations and only return the `id`
     * const locationWithIdOnly = await prisma.location.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocationUpdateManyAndReturnArgs>(args: SelectSubset<T, LocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Location.
     * @param {LocationUpsertArgs} args - Arguments to update or create a Location.
     * @example
     * // Update or create a Location
     * const location = await prisma.location.upsert({
     *   create: {
     *     // ... data to create a Location
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Location we want to update
     *   }
     * })
     */
    upsert<T extends LocationUpsertArgs>(args: SelectSubset<T, LocationUpsertArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationCountArgs} args - Arguments to filter Locations to count.
     * @example
     * // Count the number of Locations
     * const count = await prisma.location.count({
     *   where: {
     *     // ... the filter for the Locations we want to count
     *   }
     * })
    **/
    count<T extends LocationCountArgs>(
      args?: Subset<T, LocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocationAggregateArgs>(args: Subset<T, LocationAggregateArgs>): Prisma.PrismaPromise<GetLocationAggregateType<T>>

    /**
     * Group by Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationGroupByArgs['orderBy'] }
        : { orderBy?: LocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Location model
   */
  readonly fields: LocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Location.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    campaign<T extends CampaignDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CampaignDefaultArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Location model
   */
  interface LocationFieldRefs {
    readonly id: FieldRef<"Location", 'String'>
    readonly campaignId: FieldRef<"Location", 'String'>
    readonly name: FieldRef<"Location", 'String'>
    readonly description: FieldRef<"Location", 'String'>
    readonly createdAt: FieldRef<"Location", 'DateTime'>
    readonly imageUrl: FieldRef<"Location", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Location findUnique
   */
  export type LocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findUniqueOrThrow
   */
  export type LocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findFirst
   */
  export type LocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findFirstOrThrow
   */
  export type LocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findMany
   */
  export type LocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Locations to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location create
   */
  export type LocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to create a Location.
     */
    data: XOR<LocationCreateInput, LocationUncheckedCreateInput>
  }

  /**
   * Location createMany
   */
  export type LocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Location createManyAndReturn
   */
  export type LocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Location update
   */
  export type LocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to update a Location.
     */
    data: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
    /**
     * Choose, which Location to update.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location updateMany
   */
  export type LocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to update.
     */
    limit?: number
  }

  /**
   * Location updateManyAndReturn
   */
  export type LocationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Location upsert
   */
  export type LocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The filter to search for the Location to update in case it exists.
     */
    where: LocationWhereUniqueInput
    /**
     * In case the Location found by the `where` argument doesn't exist, create a new Location with this data.
     */
    create: XOR<LocationCreateInput, LocationUncheckedCreateInput>
    /**
     * In case the Location was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
  }

  /**
   * Location delete
   */
  export type LocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter which Location to delete.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location deleteMany
   */
  export type LocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Locations to delete
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to delete.
     */
    limit?: number
  }

  /**
   * Location without action
   */
  export type LocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
  }


  /**
   * Model ObjectModel
   */

  export type AggregateObjectModel = {
    _count: ObjectModelCountAggregateOutputType | null
    _min: ObjectModelMinAggregateOutputType | null
    _max: ObjectModelMaxAggregateOutputType | null
  }

  export type ObjectModelMinAggregateOutputType = {
    id: string | null
    campaignId: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    imageUrl: string | null
  }

  export type ObjectModelMaxAggregateOutputType = {
    id: string | null
    campaignId: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    imageUrl: string | null
  }

  export type ObjectModelCountAggregateOutputType = {
    id: number
    campaignId: number
    name: number
    description: number
    createdAt: number
    imageUrl: number
    _all: number
  }


  export type ObjectModelMinAggregateInputType = {
    id?: true
    campaignId?: true
    name?: true
    description?: true
    createdAt?: true
    imageUrl?: true
  }

  export type ObjectModelMaxAggregateInputType = {
    id?: true
    campaignId?: true
    name?: true
    description?: true
    createdAt?: true
    imageUrl?: true
  }

  export type ObjectModelCountAggregateInputType = {
    id?: true
    campaignId?: true
    name?: true
    description?: true
    createdAt?: true
    imageUrl?: true
    _all?: true
  }

  export type ObjectModelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ObjectModel to aggregate.
     */
    where?: ObjectModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObjectModels to fetch.
     */
    orderBy?: ObjectModelOrderByWithRelationInput | ObjectModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ObjectModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObjectModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObjectModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ObjectModels
    **/
    _count?: true | ObjectModelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ObjectModelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ObjectModelMaxAggregateInputType
  }

  export type GetObjectModelAggregateType<T extends ObjectModelAggregateArgs> = {
        [P in keyof T & keyof AggregateObjectModel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateObjectModel[P]>
      : GetScalarType<T[P], AggregateObjectModel[P]>
  }




  export type ObjectModelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObjectModelWhereInput
    orderBy?: ObjectModelOrderByWithAggregationInput | ObjectModelOrderByWithAggregationInput[]
    by: ObjectModelScalarFieldEnum[] | ObjectModelScalarFieldEnum
    having?: ObjectModelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ObjectModelCountAggregateInputType | true
    _min?: ObjectModelMinAggregateInputType
    _max?: ObjectModelMaxAggregateInputType
  }

  export type ObjectModelGroupByOutputType = {
    id: string
    campaignId: string
    name: string
    description: string | null
    createdAt: Date
    imageUrl: string | null
    _count: ObjectModelCountAggregateOutputType | null
    _min: ObjectModelMinAggregateOutputType | null
    _max: ObjectModelMaxAggregateOutputType | null
  }

  type GetObjectModelGroupByPayload<T extends ObjectModelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ObjectModelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ObjectModelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ObjectModelGroupByOutputType[P]>
            : GetScalarType<T[P], ObjectModelGroupByOutputType[P]>
        }
      >
    >


  export type ObjectModelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["objectModel"]>

  export type ObjectModelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["objectModel"]>

  export type ObjectModelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["objectModel"]>

  export type ObjectModelSelectScalar = {
    id?: boolean
    campaignId?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    imageUrl?: boolean
  }

  export type ObjectModelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "campaignId" | "name" | "description" | "createdAt" | "imageUrl", ExtArgs["result"]["objectModel"]>
  export type ObjectModelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }
  export type ObjectModelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }
  export type ObjectModelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignDefaultArgs<ExtArgs>
  }

  export type $ObjectModelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ObjectModel"
    objects: {
      campaign: Prisma.$CampaignPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      campaignId: string
      name: string
      description: string | null
      createdAt: Date
      imageUrl: string | null
    }, ExtArgs["result"]["objectModel"]>
    composites: {}
  }

  type ObjectModelGetPayload<S extends boolean | null | undefined | ObjectModelDefaultArgs> = $Result.GetResult<Prisma.$ObjectModelPayload, S>

  type ObjectModelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ObjectModelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ObjectModelCountAggregateInputType | true
    }

  export interface ObjectModelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ObjectModel'], meta: { name: 'ObjectModel' } }
    /**
     * Find zero or one ObjectModel that matches the filter.
     * @param {ObjectModelFindUniqueArgs} args - Arguments to find a ObjectModel
     * @example
     * // Get one ObjectModel
     * const objectModel = await prisma.objectModel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ObjectModelFindUniqueArgs>(args: SelectSubset<T, ObjectModelFindUniqueArgs<ExtArgs>>): Prisma__ObjectModelClient<$Result.GetResult<Prisma.$ObjectModelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ObjectModel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ObjectModelFindUniqueOrThrowArgs} args - Arguments to find a ObjectModel
     * @example
     * // Get one ObjectModel
     * const objectModel = await prisma.objectModel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ObjectModelFindUniqueOrThrowArgs>(args: SelectSubset<T, ObjectModelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ObjectModelClient<$Result.GetResult<Prisma.$ObjectModelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ObjectModel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectModelFindFirstArgs} args - Arguments to find a ObjectModel
     * @example
     * // Get one ObjectModel
     * const objectModel = await prisma.objectModel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ObjectModelFindFirstArgs>(args?: SelectSubset<T, ObjectModelFindFirstArgs<ExtArgs>>): Prisma__ObjectModelClient<$Result.GetResult<Prisma.$ObjectModelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ObjectModel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectModelFindFirstOrThrowArgs} args - Arguments to find a ObjectModel
     * @example
     * // Get one ObjectModel
     * const objectModel = await prisma.objectModel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ObjectModelFindFirstOrThrowArgs>(args?: SelectSubset<T, ObjectModelFindFirstOrThrowArgs<ExtArgs>>): Prisma__ObjectModelClient<$Result.GetResult<Prisma.$ObjectModelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ObjectModels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectModelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ObjectModels
     * const objectModels = await prisma.objectModel.findMany()
     * 
     * // Get first 10 ObjectModels
     * const objectModels = await prisma.objectModel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const objectModelWithIdOnly = await prisma.objectModel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ObjectModelFindManyArgs>(args?: SelectSubset<T, ObjectModelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjectModelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ObjectModel.
     * @param {ObjectModelCreateArgs} args - Arguments to create a ObjectModel.
     * @example
     * // Create one ObjectModel
     * const ObjectModel = await prisma.objectModel.create({
     *   data: {
     *     // ... data to create a ObjectModel
     *   }
     * })
     * 
     */
    create<T extends ObjectModelCreateArgs>(args: SelectSubset<T, ObjectModelCreateArgs<ExtArgs>>): Prisma__ObjectModelClient<$Result.GetResult<Prisma.$ObjectModelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ObjectModels.
     * @param {ObjectModelCreateManyArgs} args - Arguments to create many ObjectModels.
     * @example
     * // Create many ObjectModels
     * const objectModel = await prisma.objectModel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ObjectModelCreateManyArgs>(args?: SelectSubset<T, ObjectModelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ObjectModels and returns the data saved in the database.
     * @param {ObjectModelCreateManyAndReturnArgs} args - Arguments to create many ObjectModels.
     * @example
     * // Create many ObjectModels
     * const objectModel = await prisma.objectModel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ObjectModels and only return the `id`
     * const objectModelWithIdOnly = await prisma.objectModel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ObjectModelCreateManyAndReturnArgs>(args?: SelectSubset<T, ObjectModelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjectModelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ObjectModel.
     * @param {ObjectModelDeleteArgs} args - Arguments to delete one ObjectModel.
     * @example
     * // Delete one ObjectModel
     * const ObjectModel = await prisma.objectModel.delete({
     *   where: {
     *     // ... filter to delete one ObjectModel
     *   }
     * })
     * 
     */
    delete<T extends ObjectModelDeleteArgs>(args: SelectSubset<T, ObjectModelDeleteArgs<ExtArgs>>): Prisma__ObjectModelClient<$Result.GetResult<Prisma.$ObjectModelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ObjectModel.
     * @param {ObjectModelUpdateArgs} args - Arguments to update one ObjectModel.
     * @example
     * // Update one ObjectModel
     * const objectModel = await prisma.objectModel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ObjectModelUpdateArgs>(args: SelectSubset<T, ObjectModelUpdateArgs<ExtArgs>>): Prisma__ObjectModelClient<$Result.GetResult<Prisma.$ObjectModelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ObjectModels.
     * @param {ObjectModelDeleteManyArgs} args - Arguments to filter ObjectModels to delete.
     * @example
     * // Delete a few ObjectModels
     * const { count } = await prisma.objectModel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ObjectModelDeleteManyArgs>(args?: SelectSubset<T, ObjectModelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ObjectModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectModelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ObjectModels
     * const objectModel = await prisma.objectModel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ObjectModelUpdateManyArgs>(args: SelectSubset<T, ObjectModelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ObjectModels and returns the data updated in the database.
     * @param {ObjectModelUpdateManyAndReturnArgs} args - Arguments to update many ObjectModels.
     * @example
     * // Update many ObjectModels
     * const objectModel = await prisma.objectModel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ObjectModels and only return the `id`
     * const objectModelWithIdOnly = await prisma.objectModel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ObjectModelUpdateManyAndReturnArgs>(args: SelectSubset<T, ObjectModelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjectModelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ObjectModel.
     * @param {ObjectModelUpsertArgs} args - Arguments to update or create a ObjectModel.
     * @example
     * // Update or create a ObjectModel
     * const objectModel = await prisma.objectModel.upsert({
     *   create: {
     *     // ... data to create a ObjectModel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ObjectModel we want to update
     *   }
     * })
     */
    upsert<T extends ObjectModelUpsertArgs>(args: SelectSubset<T, ObjectModelUpsertArgs<ExtArgs>>): Prisma__ObjectModelClient<$Result.GetResult<Prisma.$ObjectModelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ObjectModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectModelCountArgs} args - Arguments to filter ObjectModels to count.
     * @example
     * // Count the number of ObjectModels
     * const count = await prisma.objectModel.count({
     *   where: {
     *     // ... the filter for the ObjectModels we want to count
     *   }
     * })
    **/
    count<T extends ObjectModelCountArgs>(
      args?: Subset<T, ObjectModelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ObjectModelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ObjectModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectModelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ObjectModelAggregateArgs>(args: Subset<T, ObjectModelAggregateArgs>): Prisma.PrismaPromise<GetObjectModelAggregateType<T>>

    /**
     * Group by ObjectModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectModelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ObjectModelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ObjectModelGroupByArgs['orderBy'] }
        : { orderBy?: ObjectModelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ObjectModelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetObjectModelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ObjectModel model
   */
  readonly fields: ObjectModelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ObjectModel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ObjectModelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    campaign<T extends CampaignDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CampaignDefaultArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ObjectModel model
   */
  interface ObjectModelFieldRefs {
    readonly id: FieldRef<"ObjectModel", 'String'>
    readonly campaignId: FieldRef<"ObjectModel", 'String'>
    readonly name: FieldRef<"ObjectModel", 'String'>
    readonly description: FieldRef<"ObjectModel", 'String'>
    readonly createdAt: FieldRef<"ObjectModel", 'DateTime'>
    readonly imageUrl: FieldRef<"ObjectModel", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ObjectModel findUnique
   */
  export type ObjectModelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelInclude<ExtArgs> | null
    /**
     * Filter, which ObjectModel to fetch.
     */
    where: ObjectModelWhereUniqueInput
  }

  /**
   * ObjectModel findUniqueOrThrow
   */
  export type ObjectModelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelInclude<ExtArgs> | null
    /**
     * Filter, which ObjectModel to fetch.
     */
    where: ObjectModelWhereUniqueInput
  }

  /**
   * ObjectModel findFirst
   */
  export type ObjectModelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelInclude<ExtArgs> | null
    /**
     * Filter, which ObjectModel to fetch.
     */
    where?: ObjectModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObjectModels to fetch.
     */
    orderBy?: ObjectModelOrderByWithRelationInput | ObjectModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ObjectModels.
     */
    cursor?: ObjectModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObjectModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObjectModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ObjectModels.
     */
    distinct?: ObjectModelScalarFieldEnum | ObjectModelScalarFieldEnum[]
  }

  /**
   * ObjectModel findFirstOrThrow
   */
  export type ObjectModelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelInclude<ExtArgs> | null
    /**
     * Filter, which ObjectModel to fetch.
     */
    where?: ObjectModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObjectModels to fetch.
     */
    orderBy?: ObjectModelOrderByWithRelationInput | ObjectModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ObjectModels.
     */
    cursor?: ObjectModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObjectModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObjectModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ObjectModels.
     */
    distinct?: ObjectModelScalarFieldEnum | ObjectModelScalarFieldEnum[]
  }

  /**
   * ObjectModel findMany
   */
  export type ObjectModelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelInclude<ExtArgs> | null
    /**
     * Filter, which ObjectModels to fetch.
     */
    where?: ObjectModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObjectModels to fetch.
     */
    orderBy?: ObjectModelOrderByWithRelationInput | ObjectModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ObjectModels.
     */
    cursor?: ObjectModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObjectModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObjectModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ObjectModels.
     */
    distinct?: ObjectModelScalarFieldEnum | ObjectModelScalarFieldEnum[]
  }

  /**
   * ObjectModel create
   */
  export type ObjectModelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelInclude<ExtArgs> | null
    /**
     * The data needed to create a ObjectModel.
     */
    data: XOR<ObjectModelCreateInput, ObjectModelUncheckedCreateInput>
  }

  /**
   * ObjectModel createMany
   */
  export type ObjectModelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ObjectModels.
     */
    data: ObjectModelCreateManyInput | ObjectModelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ObjectModel createManyAndReturn
   */
  export type ObjectModelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * The data used to create many ObjectModels.
     */
    data: ObjectModelCreateManyInput | ObjectModelCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ObjectModel update
   */
  export type ObjectModelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelInclude<ExtArgs> | null
    /**
     * The data needed to update a ObjectModel.
     */
    data: XOR<ObjectModelUpdateInput, ObjectModelUncheckedUpdateInput>
    /**
     * Choose, which ObjectModel to update.
     */
    where: ObjectModelWhereUniqueInput
  }

  /**
   * ObjectModel updateMany
   */
  export type ObjectModelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ObjectModels.
     */
    data: XOR<ObjectModelUpdateManyMutationInput, ObjectModelUncheckedUpdateManyInput>
    /**
     * Filter which ObjectModels to update
     */
    where?: ObjectModelWhereInput
    /**
     * Limit how many ObjectModels to update.
     */
    limit?: number
  }

  /**
   * ObjectModel updateManyAndReturn
   */
  export type ObjectModelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * The data used to update ObjectModels.
     */
    data: XOR<ObjectModelUpdateManyMutationInput, ObjectModelUncheckedUpdateManyInput>
    /**
     * Filter which ObjectModels to update
     */
    where?: ObjectModelWhereInput
    /**
     * Limit how many ObjectModels to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ObjectModel upsert
   */
  export type ObjectModelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelInclude<ExtArgs> | null
    /**
     * The filter to search for the ObjectModel to update in case it exists.
     */
    where: ObjectModelWhereUniqueInput
    /**
     * In case the ObjectModel found by the `where` argument doesn't exist, create a new ObjectModel with this data.
     */
    create: XOR<ObjectModelCreateInput, ObjectModelUncheckedCreateInput>
    /**
     * In case the ObjectModel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ObjectModelUpdateInput, ObjectModelUncheckedUpdateInput>
  }

  /**
   * ObjectModel delete
   */
  export type ObjectModelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelInclude<ExtArgs> | null
    /**
     * Filter which ObjectModel to delete.
     */
    where: ObjectModelWhereUniqueInput
  }

  /**
   * ObjectModel deleteMany
   */
  export type ObjectModelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ObjectModels to delete
     */
    where?: ObjectModelWhereInput
    /**
     * Limit how many ObjectModels to delete.
     */
    limit?: number
  }

  /**
   * ObjectModel without action
   */
  export type ObjectModelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjectModel
     */
    select?: ObjectModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjectModel
     */
    omit?: ObjectModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectModelInclude<ExtArgs> | null
  }


  /**
   * Model Relation
   */

  export type AggregateRelation = {
    _count: RelationCountAggregateOutputType | null
    _min: RelationMinAggregateOutputType | null
    _max: RelationMaxAggregateOutputType | null
  }

  export type RelationMinAggregateOutputType = {
    id: string | null
    fromType: $Enums.NodeType | null
    fromId: string | null
    toType: $Enums.NodeType | null
    toId: string | null
    kind: $Enums.RelationType | null
    createdAt: Date | null
  }

  export type RelationMaxAggregateOutputType = {
    id: string | null
    fromType: $Enums.NodeType | null
    fromId: string | null
    toType: $Enums.NodeType | null
    toId: string | null
    kind: $Enums.RelationType | null
    createdAt: Date | null
  }

  export type RelationCountAggregateOutputType = {
    id: number
    fromType: number
    fromId: number
    toType: number
    toId: number
    kind: number
    createdAt: number
    _all: number
  }


  export type RelationMinAggregateInputType = {
    id?: true
    fromType?: true
    fromId?: true
    toType?: true
    toId?: true
    kind?: true
    createdAt?: true
  }

  export type RelationMaxAggregateInputType = {
    id?: true
    fromType?: true
    fromId?: true
    toType?: true
    toId?: true
    kind?: true
    createdAt?: true
  }

  export type RelationCountAggregateInputType = {
    id?: true
    fromType?: true
    fromId?: true
    toType?: true
    toId?: true
    kind?: true
    createdAt?: true
    _all?: true
  }

  export type RelationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Relation to aggregate.
     */
    where?: RelationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Relations to fetch.
     */
    orderBy?: RelationOrderByWithRelationInput | RelationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RelationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Relations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Relations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Relations
    **/
    _count?: true | RelationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RelationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RelationMaxAggregateInputType
  }

  export type GetRelationAggregateType<T extends RelationAggregateArgs> = {
        [P in keyof T & keyof AggregateRelation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRelation[P]>
      : GetScalarType<T[P], AggregateRelation[P]>
  }




  export type RelationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelationWhereInput
    orderBy?: RelationOrderByWithAggregationInput | RelationOrderByWithAggregationInput[]
    by: RelationScalarFieldEnum[] | RelationScalarFieldEnum
    having?: RelationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RelationCountAggregateInputType | true
    _min?: RelationMinAggregateInputType
    _max?: RelationMaxAggregateInputType
  }

  export type RelationGroupByOutputType = {
    id: string
    fromType: $Enums.NodeType
    fromId: string
    toType: $Enums.NodeType
    toId: string
    kind: $Enums.RelationType
    createdAt: Date
    _count: RelationCountAggregateOutputType | null
    _min: RelationMinAggregateOutputType | null
    _max: RelationMaxAggregateOutputType | null
  }

  type GetRelationGroupByPayload<T extends RelationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RelationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RelationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RelationGroupByOutputType[P]>
            : GetScalarType<T[P], RelationGroupByOutputType[P]>
        }
      >
    >


  export type RelationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromType?: boolean
    fromId?: boolean
    toType?: boolean
    toId?: boolean
    kind?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["relation"]>

  export type RelationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromType?: boolean
    fromId?: boolean
    toType?: boolean
    toId?: boolean
    kind?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["relation"]>

  export type RelationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromType?: boolean
    fromId?: boolean
    toType?: boolean
    toId?: boolean
    kind?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["relation"]>

  export type RelationSelectScalar = {
    id?: boolean
    fromType?: boolean
    fromId?: boolean
    toType?: boolean
    toId?: boolean
    kind?: boolean
    createdAt?: boolean
  }

  export type RelationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fromType" | "fromId" | "toType" | "toId" | "kind" | "createdAt", ExtArgs["result"]["relation"]>

  export type $RelationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Relation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fromType: $Enums.NodeType
      fromId: string
      toType: $Enums.NodeType
      toId: string
      kind: $Enums.RelationType
      createdAt: Date
    }, ExtArgs["result"]["relation"]>
    composites: {}
  }

  type RelationGetPayload<S extends boolean | null | undefined | RelationDefaultArgs> = $Result.GetResult<Prisma.$RelationPayload, S>

  type RelationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RelationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RelationCountAggregateInputType | true
    }

  export interface RelationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Relation'], meta: { name: 'Relation' } }
    /**
     * Find zero or one Relation that matches the filter.
     * @param {RelationFindUniqueArgs} args - Arguments to find a Relation
     * @example
     * // Get one Relation
     * const relation = await prisma.relation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RelationFindUniqueArgs>(args: SelectSubset<T, RelationFindUniqueArgs<ExtArgs>>): Prisma__RelationClient<$Result.GetResult<Prisma.$RelationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Relation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RelationFindUniqueOrThrowArgs} args - Arguments to find a Relation
     * @example
     * // Get one Relation
     * const relation = await prisma.relation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RelationFindUniqueOrThrowArgs>(args: SelectSubset<T, RelationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RelationClient<$Result.GetResult<Prisma.$RelationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Relation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationFindFirstArgs} args - Arguments to find a Relation
     * @example
     * // Get one Relation
     * const relation = await prisma.relation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RelationFindFirstArgs>(args?: SelectSubset<T, RelationFindFirstArgs<ExtArgs>>): Prisma__RelationClient<$Result.GetResult<Prisma.$RelationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Relation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationFindFirstOrThrowArgs} args - Arguments to find a Relation
     * @example
     * // Get one Relation
     * const relation = await prisma.relation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RelationFindFirstOrThrowArgs>(args?: SelectSubset<T, RelationFindFirstOrThrowArgs<ExtArgs>>): Prisma__RelationClient<$Result.GetResult<Prisma.$RelationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Relations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Relations
     * const relations = await prisma.relation.findMany()
     * 
     * // Get first 10 Relations
     * const relations = await prisma.relation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const relationWithIdOnly = await prisma.relation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RelationFindManyArgs>(args?: SelectSubset<T, RelationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Relation.
     * @param {RelationCreateArgs} args - Arguments to create a Relation.
     * @example
     * // Create one Relation
     * const Relation = await prisma.relation.create({
     *   data: {
     *     // ... data to create a Relation
     *   }
     * })
     * 
     */
    create<T extends RelationCreateArgs>(args: SelectSubset<T, RelationCreateArgs<ExtArgs>>): Prisma__RelationClient<$Result.GetResult<Prisma.$RelationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Relations.
     * @param {RelationCreateManyArgs} args - Arguments to create many Relations.
     * @example
     * // Create many Relations
     * const relation = await prisma.relation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RelationCreateManyArgs>(args?: SelectSubset<T, RelationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Relations and returns the data saved in the database.
     * @param {RelationCreateManyAndReturnArgs} args - Arguments to create many Relations.
     * @example
     * // Create many Relations
     * const relation = await prisma.relation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Relations and only return the `id`
     * const relationWithIdOnly = await prisma.relation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RelationCreateManyAndReturnArgs>(args?: SelectSubset<T, RelationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Relation.
     * @param {RelationDeleteArgs} args - Arguments to delete one Relation.
     * @example
     * // Delete one Relation
     * const Relation = await prisma.relation.delete({
     *   where: {
     *     // ... filter to delete one Relation
     *   }
     * })
     * 
     */
    delete<T extends RelationDeleteArgs>(args: SelectSubset<T, RelationDeleteArgs<ExtArgs>>): Prisma__RelationClient<$Result.GetResult<Prisma.$RelationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Relation.
     * @param {RelationUpdateArgs} args - Arguments to update one Relation.
     * @example
     * // Update one Relation
     * const relation = await prisma.relation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RelationUpdateArgs>(args: SelectSubset<T, RelationUpdateArgs<ExtArgs>>): Prisma__RelationClient<$Result.GetResult<Prisma.$RelationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Relations.
     * @param {RelationDeleteManyArgs} args - Arguments to filter Relations to delete.
     * @example
     * // Delete a few Relations
     * const { count } = await prisma.relation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RelationDeleteManyArgs>(args?: SelectSubset<T, RelationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Relations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Relations
     * const relation = await prisma.relation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RelationUpdateManyArgs>(args: SelectSubset<T, RelationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Relations and returns the data updated in the database.
     * @param {RelationUpdateManyAndReturnArgs} args - Arguments to update many Relations.
     * @example
     * // Update many Relations
     * const relation = await prisma.relation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Relations and only return the `id`
     * const relationWithIdOnly = await prisma.relation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RelationUpdateManyAndReturnArgs>(args: SelectSubset<T, RelationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Relation.
     * @param {RelationUpsertArgs} args - Arguments to update or create a Relation.
     * @example
     * // Update or create a Relation
     * const relation = await prisma.relation.upsert({
     *   create: {
     *     // ... data to create a Relation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Relation we want to update
     *   }
     * })
     */
    upsert<T extends RelationUpsertArgs>(args: SelectSubset<T, RelationUpsertArgs<ExtArgs>>): Prisma__RelationClient<$Result.GetResult<Prisma.$RelationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Relations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationCountArgs} args - Arguments to filter Relations to count.
     * @example
     * // Count the number of Relations
     * const count = await prisma.relation.count({
     *   where: {
     *     // ... the filter for the Relations we want to count
     *   }
     * })
    **/
    count<T extends RelationCountArgs>(
      args?: Subset<T, RelationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RelationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Relation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RelationAggregateArgs>(args: Subset<T, RelationAggregateArgs>): Prisma.PrismaPromise<GetRelationAggregateType<T>>

    /**
     * Group by Relation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RelationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RelationGroupByArgs['orderBy'] }
        : { orderBy?: RelationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RelationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRelationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Relation model
   */
  readonly fields: RelationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Relation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RelationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Relation model
   */
  interface RelationFieldRefs {
    readonly id: FieldRef<"Relation", 'String'>
    readonly fromType: FieldRef<"Relation", 'NodeType'>
    readonly fromId: FieldRef<"Relation", 'String'>
    readonly toType: FieldRef<"Relation", 'NodeType'>
    readonly toId: FieldRef<"Relation", 'String'>
    readonly kind: FieldRef<"Relation", 'RelationType'>
    readonly createdAt: FieldRef<"Relation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Relation findUnique
   */
  export type RelationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relation
     */
    select?: RelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relation
     */
    omit?: RelationOmit<ExtArgs> | null
    /**
     * Filter, which Relation to fetch.
     */
    where: RelationWhereUniqueInput
  }

  /**
   * Relation findUniqueOrThrow
   */
  export type RelationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relation
     */
    select?: RelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relation
     */
    omit?: RelationOmit<ExtArgs> | null
    /**
     * Filter, which Relation to fetch.
     */
    where: RelationWhereUniqueInput
  }

  /**
   * Relation findFirst
   */
  export type RelationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relation
     */
    select?: RelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relation
     */
    omit?: RelationOmit<ExtArgs> | null
    /**
     * Filter, which Relation to fetch.
     */
    where?: RelationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Relations to fetch.
     */
    orderBy?: RelationOrderByWithRelationInput | RelationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Relations.
     */
    cursor?: RelationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Relations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Relations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Relations.
     */
    distinct?: RelationScalarFieldEnum | RelationScalarFieldEnum[]
  }

  /**
   * Relation findFirstOrThrow
   */
  export type RelationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relation
     */
    select?: RelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relation
     */
    omit?: RelationOmit<ExtArgs> | null
    /**
     * Filter, which Relation to fetch.
     */
    where?: RelationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Relations to fetch.
     */
    orderBy?: RelationOrderByWithRelationInput | RelationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Relations.
     */
    cursor?: RelationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Relations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Relations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Relations.
     */
    distinct?: RelationScalarFieldEnum | RelationScalarFieldEnum[]
  }

  /**
   * Relation findMany
   */
  export type RelationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relation
     */
    select?: RelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relation
     */
    omit?: RelationOmit<ExtArgs> | null
    /**
     * Filter, which Relations to fetch.
     */
    where?: RelationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Relations to fetch.
     */
    orderBy?: RelationOrderByWithRelationInput | RelationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Relations.
     */
    cursor?: RelationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Relations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Relations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Relations.
     */
    distinct?: RelationScalarFieldEnum | RelationScalarFieldEnum[]
  }

  /**
   * Relation create
   */
  export type RelationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relation
     */
    select?: RelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relation
     */
    omit?: RelationOmit<ExtArgs> | null
    /**
     * The data needed to create a Relation.
     */
    data: XOR<RelationCreateInput, RelationUncheckedCreateInput>
  }

  /**
   * Relation createMany
   */
  export type RelationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Relations.
     */
    data: RelationCreateManyInput | RelationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Relation createManyAndReturn
   */
  export type RelationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relation
     */
    select?: RelationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Relation
     */
    omit?: RelationOmit<ExtArgs> | null
    /**
     * The data used to create many Relations.
     */
    data: RelationCreateManyInput | RelationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Relation update
   */
  export type RelationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relation
     */
    select?: RelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relation
     */
    omit?: RelationOmit<ExtArgs> | null
    /**
     * The data needed to update a Relation.
     */
    data: XOR<RelationUpdateInput, RelationUncheckedUpdateInput>
    /**
     * Choose, which Relation to update.
     */
    where: RelationWhereUniqueInput
  }

  /**
   * Relation updateMany
   */
  export type RelationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Relations.
     */
    data: XOR<RelationUpdateManyMutationInput, RelationUncheckedUpdateManyInput>
    /**
     * Filter which Relations to update
     */
    where?: RelationWhereInput
    /**
     * Limit how many Relations to update.
     */
    limit?: number
  }

  /**
   * Relation updateManyAndReturn
   */
  export type RelationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relation
     */
    select?: RelationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Relation
     */
    omit?: RelationOmit<ExtArgs> | null
    /**
     * The data used to update Relations.
     */
    data: XOR<RelationUpdateManyMutationInput, RelationUncheckedUpdateManyInput>
    /**
     * Filter which Relations to update
     */
    where?: RelationWhereInput
    /**
     * Limit how many Relations to update.
     */
    limit?: number
  }

  /**
   * Relation upsert
   */
  export type RelationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relation
     */
    select?: RelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relation
     */
    omit?: RelationOmit<ExtArgs> | null
    /**
     * The filter to search for the Relation to update in case it exists.
     */
    where: RelationWhereUniqueInput
    /**
     * In case the Relation found by the `where` argument doesn't exist, create a new Relation with this data.
     */
    create: XOR<RelationCreateInput, RelationUncheckedCreateInput>
    /**
     * In case the Relation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RelationUpdateInput, RelationUncheckedUpdateInput>
  }

  /**
   * Relation delete
   */
  export type RelationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relation
     */
    select?: RelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relation
     */
    omit?: RelationOmit<ExtArgs> | null
    /**
     * Filter which Relation to delete.
     */
    where: RelationWhereUniqueInput
  }

  /**
   * Relation deleteMany
   */
  export type RelationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Relations to delete
     */
    where?: RelationWhereInput
    /**
     * Limit how many Relations to delete.
     */
    limit?: number
  }

  /**
   * Relation without action
   */
  export type RelationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Relation
     */
    select?: RelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Relation
     */
    omit?: RelationOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CampaignScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    description: 'description',
    imageUrl: 'imageUrl'
  };

  export type CampaignScalarFieldEnum = (typeof CampaignScalarFieldEnum)[keyof typeof CampaignScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    campaignId: 'campaignId',
    title: 'title',
    description: 'description',
    createdAt: 'createdAt',
    imageUrl: 'imageUrl'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const CharacterScalarFieldEnum: {
    id: 'id',
    campaignId: 'campaignId',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    imageUrl: 'imageUrl'
  };

  export type CharacterScalarFieldEnum = (typeof CharacterScalarFieldEnum)[keyof typeof CharacterScalarFieldEnum]


  export const LocationScalarFieldEnum: {
    id: 'id',
    campaignId: 'campaignId',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    imageUrl: 'imageUrl'
  };

  export type LocationScalarFieldEnum = (typeof LocationScalarFieldEnum)[keyof typeof LocationScalarFieldEnum]


  export const ObjectModelScalarFieldEnum: {
    id: 'id',
    campaignId: 'campaignId',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    imageUrl: 'imageUrl'
  };

  export type ObjectModelScalarFieldEnum = (typeof ObjectModelScalarFieldEnum)[keyof typeof ObjectModelScalarFieldEnum]


  export const RelationScalarFieldEnum: {
    id: 'id',
    fromType: 'fromType',
    fromId: 'fromId',
    toType: 'toType',
    toId: 'toId',
    kind: 'kind',
    createdAt: 'createdAt'
  };

  export type RelationScalarFieldEnum = (typeof RelationScalarFieldEnum)[keyof typeof RelationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'NodeType'
   */
  export type EnumNodeTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NodeType'>
    


  /**
   * Reference to a field of type 'NodeType[]'
   */
  export type ListEnumNodeTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NodeType[]'>
    


  /**
   * Reference to a field of type 'RelationType'
   */
  export type EnumRelationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RelationType'>
    


  /**
   * Reference to a field of type 'RelationType[]'
   */
  export type ListEnumRelationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RelationType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    campaigns?: CampaignListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    campaigns?: CampaignOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    campaigns?: CampaignListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
  }

  export type CampaignWhereInput = {
    AND?: CampaignWhereInput | CampaignWhereInput[]
    OR?: CampaignWhereInput[]
    NOT?: CampaignWhereInput | CampaignWhereInput[]
    id?: StringFilter<"Campaign"> | string
    userId?: StringFilter<"Campaign"> | string
    name?: StringFilter<"Campaign"> | string
    description?: StringNullableFilter<"Campaign"> | string | null
    imageUrl?: StringNullableFilter<"Campaign"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    characters?: CharacterListRelationFilter
    events?: EventListRelationFilter
    locations?: LocationListRelationFilter
    objects?: ObjectModelListRelationFilter
  }

  export type CampaignOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    characters?: CharacterOrderByRelationAggregateInput
    events?: EventOrderByRelationAggregateInput
    locations?: LocationOrderByRelationAggregateInput
    objects?: ObjectModelOrderByRelationAggregateInput
  }

  export type CampaignWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CampaignWhereInput | CampaignWhereInput[]
    OR?: CampaignWhereInput[]
    NOT?: CampaignWhereInput | CampaignWhereInput[]
    userId?: StringFilter<"Campaign"> | string
    name?: StringFilter<"Campaign"> | string
    description?: StringNullableFilter<"Campaign"> | string | null
    imageUrl?: StringNullableFilter<"Campaign"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    characters?: CharacterListRelationFilter
    events?: EventListRelationFilter
    locations?: LocationListRelationFilter
    objects?: ObjectModelListRelationFilter
  }, "id">

  export type CampaignOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    _count?: CampaignCountOrderByAggregateInput
    _max?: CampaignMaxOrderByAggregateInput
    _min?: CampaignMinOrderByAggregateInput
  }

  export type CampaignScalarWhereWithAggregatesInput = {
    AND?: CampaignScalarWhereWithAggregatesInput | CampaignScalarWhereWithAggregatesInput[]
    OR?: CampaignScalarWhereWithAggregatesInput[]
    NOT?: CampaignScalarWhereWithAggregatesInput | CampaignScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Campaign"> | string
    userId?: StringWithAggregatesFilter<"Campaign"> | string
    name?: StringWithAggregatesFilter<"Campaign"> | string
    description?: StringNullableWithAggregatesFilter<"Campaign"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"Campaign"> | string | null
  }

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    id?: StringFilter<"Event"> | string
    campaignId?: StringFilter<"Event"> | string
    title?: StringFilter<"Event"> | string
    description?: StringNullableFilter<"Event"> | string | null
    createdAt?: DateTimeFilter<"Event"> | Date | string
    imageUrl?: StringNullableFilter<"Event"> | string | null
    campaign?: XOR<CampaignScalarRelationFilter, CampaignWhereInput>
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    campaignId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    campaign?: CampaignOrderByWithRelationInput
  }

  export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    campaignId_title?: EventCampaignIdTitleCompoundUniqueInput
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    campaignId?: StringFilter<"Event"> | string
    title?: StringFilter<"Event"> | string
    description?: StringNullableFilter<"Event"> | string | null
    createdAt?: DateTimeFilter<"Event"> | Date | string
    imageUrl?: StringNullableFilter<"Event"> | string | null
    campaign?: XOR<CampaignScalarRelationFilter, CampaignWhereInput>
  }, "id" | "campaignId_title">

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    campaignId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    _count?: EventCountOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    OR?: EventScalarWhereWithAggregatesInput[]
    NOT?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Event"> | string
    campaignId?: StringWithAggregatesFilter<"Event"> | string
    title?: StringWithAggregatesFilter<"Event"> | string
    description?: StringNullableWithAggregatesFilter<"Event"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    imageUrl?: StringNullableWithAggregatesFilter<"Event"> | string | null
  }

  export type CharacterWhereInput = {
    AND?: CharacterWhereInput | CharacterWhereInput[]
    OR?: CharacterWhereInput[]
    NOT?: CharacterWhereInput | CharacterWhereInput[]
    id?: StringFilter<"Character"> | string
    campaignId?: StringFilter<"Character"> | string
    name?: StringFilter<"Character"> | string
    description?: StringNullableFilter<"Character"> | string | null
    createdAt?: DateTimeFilter<"Character"> | Date | string
    imageUrl?: StringNullableFilter<"Character"> | string | null
    campaign?: XOR<CampaignScalarRelationFilter, CampaignWhereInput>
  }

  export type CharacterOrderByWithRelationInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    campaign?: CampaignOrderByWithRelationInput
  }

  export type CharacterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    campaignId_name?: CharacterCampaignIdNameCompoundUniqueInput
    AND?: CharacterWhereInput | CharacterWhereInput[]
    OR?: CharacterWhereInput[]
    NOT?: CharacterWhereInput | CharacterWhereInput[]
    campaignId?: StringFilter<"Character"> | string
    name?: StringFilter<"Character"> | string
    description?: StringNullableFilter<"Character"> | string | null
    createdAt?: DateTimeFilter<"Character"> | Date | string
    imageUrl?: StringNullableFilter<"Character"> | string | null
    campaign?: XOR<CampaignScalarRelationFilter, CampaignWhereInput>
  }, "id" | "campaignId_name">

  export type CharacterOrderByWithAggregationInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    _count?: CharacterCountOrderByAggregateInput
    _max?: CharacterMaxOrderByAggregateInput
    _min?: CharacterMinOrderByAggregateInput
  }

  export type CharacterScalarWhereWithAggregatesInput = {
    AND?: CharacterScalarWhereWithAggregatesInput | CharacterScalarWhereWithAggregatesInput[]
    OR?: CharacterScalarWhereWithAggregatesInput[]
    NOT?: CharacterScalarWhereWithAggregatesInput | CharacterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Character"> | string
    campaignId?: StringWithAggregatesFilter<"Character"> | string
    name?: StringWithAggregatesFilter<"Character"> | string
    description?: StringNullableWithAggregatesFilter<"Character"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Character"> | Date | string
    imageUrl?: StringNullableWithAggregatesFilter<"Character"> | string | null
  }

  export type LocationWhereInput = {
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    id?: StringFilter<"Location"> | string
    campaignId?: StringFilter<"Location"> | string
    name?: StringFilter<"Location"> | string
    description?: StringNullableFilter<"Location"> | string | null
    createdAt?: DateTimeFilter<"Location"> | Date | string
    imageUrl?: StringNullableFilter<"Location"> | string | null
    campaign?: XOR<CampaignScalarRelationFilter, CampaignWhereInput>
  }

  export type LocationOrderByWithRelationInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    campaign?: CampaignOrderByWithRelationInput
  }

  export type LocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    campaignId_name?: LocationCampaignIdNameCompoundUniqueInput
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    campaignId?: StringFilter<"Location"> | string
    name?: StringFilter<"Location"> | string
    description?: StringNullableFilter<"Location"> | string | null
    createdAt?: DateTimeFilter<"Location"> | Date | string
    imageUrl?: StringNullableFilter<"Location"> | string | null
    campaign?: XOR<CampaignScalarRelationFilter, CampaignWhereInput>
  }, "id" | "campaignId_name">

  export type LocationOrderByWithAggregationInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    _count?: LocationCountOrderByAggregateInput
    _max?: LocationMaxOrderByAggregateInput
    _min?: LocationMinOrderByAggregateInput
  }

  export type LocationScalarWhereWithAggregatesInput = {
    AND?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    OR?: LocationScalarWhereWithAggregatesInput[]
    NOT?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Location"> | string
    campaignId?: StringWithAggregatesFilter<"Location"> | string
    name?: StringWithAggregatesFilter<"Location"> | string
    description?: StringNullableWithAggregatesFilter<"Location"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Location"> | Date | string
    imageUrl?: StringNullableWithAggregatesFilter<"Location"> | string | null
  }

  export type ObjectModelWhereInput = {
    AND?: ObjectModelWhereInput | ObjectModelWhereInput[]
    OR?: ObjectModelWhereInput[]
    NOT?: ObjectModelWhereInput | ObjectModelWhereInput[]
    id?: StringFilter<"ObjectModel"> | string
    campaignId?: StringFilter<"ObjectModel"> | string
    name?: StringFilter<"ObjectModel"> | string
    description?: StringNullableFilter<"ObjectModel"> | string | null
    createdAt?: DateTimeFilter<"ObjectModel"> | Date | string
    imageUrl?: StringNullableFilter<"ObjectModel"> | string | null
    campaign?: XOR<CampaignScalarRelationFilter, CampaignWhereInput>
  }

  export type ObjectModelOrderByWithRelationInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    campaign?: CampaignOrderByWithRelationInput
  }

  export type ObjectModelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    campaignId_name?: ObjectModelCampaignIdNameCompoundUniqueInput
    AND?: ObjectModelWhereInput | ObjectModelWhereInput[]
    OR?: ObjectModelWhereInput[]
    NOT?: ObjectModelWhereInput | ObjectModelWhereInput[]
    campaignId?: StringFilter<"ObjectModel"> | string
    name?: StringFilter<"ObjectModel"> | string
    description?: StringNullableFilter<"ObjectModel"> | string | null
    createdAt?: DateTimeFilter<"ObjectModel"> | Date | string
    imageUrl?: StringNullableFilter<"ObjectModel"> | string | null
    campaign?: XOR<CampaignScalarRelationFilter, CampaignWhereInput>
  }, "id" | "campaignId_name">

  export type ObjectModelOrderByWithAggregationInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    _count?: ObjectModelCountOrderByAggregateInput
    _max?: ObjectModelMaxOrderByAggregateInput
    _min?: ObjectModelMinOrderByAggregateInput
  }

  export type ObjectModelScalarWhereWithAggregatesInput = {
    AND?: ObjectModelScalarWhereWithAggregatesInput | ObjectModelScalarWhereWithAggregatesInput[]
    OR?: ObjectModelScalarWhereWithAggregatesInput[]
    NOT?: ObjectModelScalarWhereWithAggregatesInput | ObjectModelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ObjectModel"> | string
    campaignId?: StringWithAggregatesFilter<"ObjectModel"> | string
    name?: StringWithAggregatesFilter<"ObjectModel"> | string
    description?: StringNullableWithAggregatesFilter<"ObjectModel"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ObjectModel"> | Date | string
    imageUrl?: StringNullableWithAggregatesFilter<"ObjectModel"> | string | null
  }

  export type RelationWhereInput = {
    AND?: RelationWhereInput | RelationWhereInput[]
    OR?: RelationWhereInput[]
    NOT?: RelationWhereInput | RelationWhereInput[]
    id?: StringFilter<"Relation"> | string
    fromType?: EnumNodeTypeFilter<"Relation"> | $Enums.NodeType
    fromId?: StringFilter<"Relation"> | string
    toType?: EnumNodeTypeFilter<"Relation"> | $Enums.NodeType
    toId?: StringFilter<"Relation"> | string
    kind?: EnumRelationTypeFilter<"Relation"> | $Enums.RelationType
    createdAt?: DateTimeFilter<"Relation"> | Date | string
  }

  export type RelationOrderByWithRelationInput = {
    id?: SortOrder
    fromType?: SortOrder
    fromId?: SortOrder
    toType?: SortOrder
    toId?: SortOrder
    kind?: SortOrder
    createdAt?: SortOrder
  }

  export type RelationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    fromType_fromId_toType_toId_kind?: RelationFromTypeFromIdToTypeToIdKindCompoundUniqueInput
    AND?: RelationWhereInput | RelationWhereInput[]
    OR?: RelationWhereInput[]
    NOT?: RelationWhereInput | RelationWhereInput[]
    fromType?: EnumNodeTypeFilter<"Relation"> | $Enums.NodeType
    fromId?: StringFilter<"Relation"> | string
    toType?: EnumNodeTypeFilter<"Relation"> | $Enums.NodeType
    toId?: StringFilter<"Relation"> | string
    kind?: EnumRelationTypeFilter<"Relation"> | $Enums.RelationType
    createdAt?: DateTimeFilter<"Relation"> | Date | string
  }, "id" | "fromType_fromId_toType_toId_kind">

  export type RelationOrderByWithAggregationInput = {
    id?: SortOrder
    fromType?: SortOrder
    fromId?: SortOrder
    toType?: SortOrder
    toId?: SortOrder
    kind?: SortOrder
    createdAt?: SortOrder
    _count?: RelationCountOrderByAggregateInput
    _max?: RelationMaxOrderByAggregateInput
    _min?: RelationMinOrderByAggregateInput
  }

  export type RelationScalarWhereWithAggregatesInput = {
    AND?: RelationScalarWhereWithAggregatesInput | RelationScalarWhereWithAggregatesInput[]
    OR?: RelationScalarWhereWithAggregatesInput[]
    NOT?: RelationScalarWhereWithAggregatesInput | RelationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Relation"> | string
    fromType?: EnumNodeTypeWithAggregatesFilter<"Relation"> | $Enums.NodeType
    fromId?: StringWithAggregatesFilter<"Relation"> | string
    toType?: EnumNodeTypeWithAggregatesFilter<"Relation"> | $Enums.NodeType
    toId?: StringWithAggregatesFilter<"Relation"> | string
    kind?: EnumRelationTypeWithAggregatesFilter<"Relation"> | $Enums.RelationType
    createdAt?: DateTimeWithAggregatesFilter<"Relation"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    campaigns?: CampaignCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    campaigns?: CampaignUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    campaigns?: CampaignUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    campaigns?: CampaignUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
  }

  export type CampaignCreateInput = {
    id?: string
    name: string
    description?: string | null
    imageUrl?: string | null
    user: UserCreateNestedOneWithoutCampaignsInput
    characters?: CharacterCreateNestedManyWithoutCampaignInput
    events?: EventCreateNestedManyWithoutCampaignInput
    locations?: LocationCreateNestedManyWithoutCampaignInput
    objects?: ObjectModelCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    imageUrl?: string | null
    characters?: CharacterUncheckedCreateNestedManyWithoutCampaignInput
    events?: EventUncheckedCreateNestedManyWithoutCampaignInput
    locations?: LocationUncheckedCreateNestedManyWithoutCampaignInput
    objects?: ObjectModelUncheckedCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutCampaignsNestedInput
    characters?: CharacterUpdateManyWithoutCampaignNestedInput
    events?: EventUpdateManyWithoutCampaignNestedInput
    locations?: LocationUpdateManyWithoutCampaignNestedInput
    objects?: ObjectModelUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    characters?: CharacterUncheckedUpdateManyWithoutCampaignNestedInput
    events?: EventUncheckedUpdateManyWithoutCampaignNestedInput
    locations?: LocationUncheckedUpdateManyWithoutCampaignNestedInput
    objects?: ObjectModelUncheckedUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignCreateManyInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    imageUrl?: string | null
  }

  export type CampaignUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CampaignUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventCreateInput = {
    id?: string
    title: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
    campaign: CampaignCreateNestedOneWithoutEventsInput
  }

  export type EventUncheckedCreateInput = {
    id?: string
    campaignId: string
    title: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type EventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    campaign?: CampaignUpdateOneRequiredWithoutEventsNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventCreateManyInput = {
    id?: string
    campaignId: string
    title: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type EventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CharacterCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
    campaign: CampaignCreateNestedOneWithoutCharactersInput
  }

  export type CharacterUncheckedCreateInput = {
    id?: string
    campaignId: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type CharacterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    campaign?: CampaignUpdateOneRequiredWithoutCharactersNestedInput
  }

  export type CharacterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CharacterCreateManyInput = {
    id?: string
    campaignId: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type CharacterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CharacterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocationCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
    campaign: CampaignCreateNestedOneWithoutLocationsInput
  }

  export type LocationUncheckedCreateInput = {
    id?: string
    campaignId: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type LocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    campaign?: CampaignUpdateOneRequiredWithoutLocationsNestedInput
  }

  export type LocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocationCreateManyInput = {
    id?: string
    campaignId: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type LocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ObjectModelCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
    campaign: CampaignCreateNestedOneWithoutObjectsInput
  }

  export type ObjectModelUncheckedCreateInput = {
    id?: string
    campaignId: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type ObjectModelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    campaign?: CampaignUpdateOneRequiredWithoutObjectsNestedInput
  }

  export type ObjectModelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ObjectModelCreateManyInput = {
    id?: string
    campaignId: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type ObjectModelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ObjectModelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RelationCreateInput = {
    id?: string
    fromType: $Enums.NodeType
    fromId: string
    toType: $Enums.NodeType
    toId: string
    kind: $Enums.RelationType
    createdAt?: Date | string
  }

  export type RelationUncheckedCreateInput = {
    id?: string
    fromType: $Enums.NodeType
    fromId: string
    toType: $Enums.NodeType
    toId: string
    kind: $Enums.RelationType
    createdAt?: Date | string
  }

  export type RelationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    fromId?: StringFieldUpdateOperationsInput | string
    toType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    toId?: StringFieldUpdateOperationsInput | string
    kind?: EnumRelationTypeFieldUpdateOperationsInput | $Enums.RelationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    fromId?: StringFieldUpdateOperationsInput | string
    toType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    toId?: StringFieldUpdateOperationsInput | string
    kind?: EnumRelationTypeFieldUpdateOperationsInput | $Enums.RelationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelationCreateManyInput = {
    id?: string
    fromType: $Enums.NodeType
    fromId: string
    toType: $Enums.NodeType
    toId: string
    kind: $Enums.RelationType
    createdAt?: Date | string
  }

  export type RelationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    fromId?: StringFieldUpdateOperationsInput | string
    toType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    toId?: StringFieldUpdateOperationsInput | string
    kind?: EnumRelationTypeFieldUpdateOperationsInput | $Enums.RelationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    fromId?: StringFieldUpdateOperationsInput | string
    toType?: EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType
    toId?: StringFieldUpdateOperationsInput | string
    kind?: EnumRelationTypeFieldUpdateOperationsInput | $Enums.RelationType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type CampaignListRelationFilter = {
    every?: CampaignWhereInput
    some?: CampaignWhereInput
    none?: CampaignWhereInput
  }

  export type CampaignOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CharacterListRelationFilter = {
    every?: CharacterWhereInput
    some?: CharacterWhereInput
    none?: CharacterWhereInput
  }

  export type EventListRelationFilter = {
    every?: EventWhereInput
    some?: EventWhereInput
    none?: EventWhereInput
  }

  export type LocationListRelationFilter = {
    every?: LocationWhereInput
    some?: LocationWhereInput
    none?: LocationWhereInput
  }

  export type ObjectModelListRelationFilter = {
    every?: ObjectModelWhereInput
    some?: ObjectModelWhereInput
    none?: ObjectModelWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CharacterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ObjectModelOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CampaignCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
  }

  export type CampaignMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
  }

  export type CampaignMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CampaignScalarRelationFilter = {
    is?: CampaignWhereInput
    isNot?: CampaignWhereInput
  }

  export type EventCampaignIdTitleCompoundUniqueInput = {
    campaignId: string
    title: string
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type CharacterCampaignIdNameCompoundUniqueInput = {
    campaignId: string
    name: string
  }

  export type CharacterCountOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type CharacterMaxOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type CharacterMinOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type LocationCampaignIdNameCompoundUniqueInput = {
    campaignId: string
    name: string
  }

  export type LocationCountOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type LocationMaxOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type LocationMinOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type ObjectModelCampaignIdNameCompoundUniqueInput = {
    campaignId: string
    name: string
  }

  export type ObjectModelCountOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type ObjectModelMaxOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type ObjectModelMinOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    imageUrl?: SortOrder
  }

  export type EnumNodeTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NodeType | EnumNodeTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNodeTypeFilter<$PrismaModel> | $Enums.NodeType
  }

  export type EnumRelationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RelationType | EnumRelationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RelationType[] | ListEnumRelationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RelationType[] | ListEnumRelationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRelationTypeFilter<$PrismaModel> | $Enums.RelationType
  }

  export type RelationFromTypeFromIdToTypeToIdKindCompoundUniqueInput = {
    fromType: $Enums.NodeType
    fromId: string
    toType: $Enums.NodeType
    toId: string
    kind: $Enums.RelationType
  }

  export type RelationCountOrderByAggregateInput = {
    id?: SortOrder
    fromType?: SortOrder
    fromId?: SortOrder
    toType?: SortOrder
    toId?: SortOrder
    kind?: SortOrder
    createdAt?: SortOrder
  }

  export type RelationMaxOrderByAggregateInput = {
    id?: SortOrder
    fromType?: SortOrder
    fromId?: SortOrder
    toType?: SortOrder
    toId?: SortOrder
    kind?: SortOrder
    createdAt?: SortOrder
  }

  export type RelationMinOrderByAggregateInput = {
    id?: SortOrder
    fromType?: SortOrder
    fromId?: SortOrder
    toType?: SortOrder
    toId?: SortOrder
    kind?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumNodeTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NodeType | EnumNodeTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNodeTypeWithAggregatesFilter<$PrismaModel> | $Enums.NodeType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNodeTypeFilter<$PrismaModel>
    _max?: NestedEnumNodeTypeFilter<$PrismaModel>
  }

  export type EnumRelationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RelationType | EnumRelationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RelationType[] | ListEnumRelationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RelationType[] | ListEnumRelationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRelationTypeWithAggregatesFilter<$PrismaModel> | $Enums.RelationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRelationTypeFilter<$PrismaModel>
    _max?: NestedEnumRelationTypeFilter<$PrismaModel>
  }

  export type CampaignCreateNestedManyWithoutUserInput = {
    create?: XOR<CampaignCreateWithoutUserInput, CampaignUncheckedCreateWithoutUserInput> | CampaignCreateWithoutUserInput[] | CampaignUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CampaignCreateOrConnectWithoutUserInput | CampaignCreateOrConnectWithoutUserInput[]
    createMany?: CampaignCreateManyUserInputEnvelope
    connect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
  }

  export type CampaignUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CampaignCreateWithoutUserInput, CampaignUncheckedCreateWithoutUserInput> | CampaignCreateWithoutUserInput[] | CampaignUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CampaignCreateOrConnectWithoutUserInput | CampaignCreateOrConnectWithoutUserInput[]
    createMany?: CampaignCreateManyUserInputEnvelope
    connect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type CampaignUpdateManyWithoutUserNestedInput = {
    create?: XOR<CampaignCreateWithoutUserInput, CampaignUncheckedCreateWithoutUserInput> | CampaignCreateWithoutUserInput[] | CampaignUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CampaignCreateOrConnectWithoutUserInput | CampaignCreateOrConnectWithoutUserInput[]
    upsert?: CampaignUpsertWithWhereUniqueWithoutUserInput | CampaignUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CampaignCreateManyUserInputEnvelope
    set?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    disconnect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    delete?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    connect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    update?: CampaignUpdateWithWhereUniqueWithoutUserInput | CampaignUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CampaignUpdateManyWithWhereWithoutUserInput | CampaignUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CampaignScalarWhereInput | CampaignScalarWhereInput[]
  }

  export type CampaignUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CampaignCreateWithoutUserInput, CampaignUncheckedCreateWithoutUserInput> | CampaignCreateWithoutUserInput[] | CampaignUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CampaignCreateOrConnectWithoutUserInput | CampaignCreateOrConnectWithoutUserInput[]
    upsert?: CampaignUpsertWithWhereUniqueWithoutUserInput | CampaignUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CampaignCreateManyUserInputEnvelope
    set?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    disconnect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    delete?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    connect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    update?: CampaignUpdateWithWhereUniqueWithoutUserInput | CampaignUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CampaignUpdateManyWithWhereWithoutUserInput | CampaignUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CampaignScalarWhereInput | CampaignScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCampaignsInput = {
    create?: XOR<UserCreateWithoutCampaignsInput, UserUncheckedCreateWithoutCampaignsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCampaignsInput
    connect?: UserWhereUniqueInput
  }

  export type CharacterCreateNestedManyWithoutCampaignInput = {
    create?: XOR<CharacterCreateWithoutCampaignInput, CharacterUncheckedCreateWithoutCampaignInput> | CharacterCreateWithoutCampaignInput[] | CharacterUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: CharacterCreateOrConnectWithoutCampaignInput | CharacterCreateOrConnectWithoutCampaignInput[]
    createMany?: CharacterCreateManyCampaignInputEnvelope
    connect?: CharacterWhereUniqueInput | CharacterWhereUniqueInput[]
  }

  export type EventCreateNestedManyWithoutCampaignInput = {
    create?: XOR<EventCreateWithoutCampaignInput, EventUncheckedCreateWithoutCampaignInput> | EventCreateWithoutCampaignInput[] | EventUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: EventCreateOrConnectWithoutCampaignInput | EventCreateOrConnectWithoutCampaignInput[]
    createMany?: EventCreateManyCampaignInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type LocationCreateNestedManyWithoutCampaignInput = {
    create?: XOR<LocationCreateWithoutCampaignInput, LocationUncheckedCreateWithoutCampaignInput> | LocationCreateWithoutCampaignInput[] | LocationUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutCampaignInput | LocationCreateOrConnectWithoutCampaignInput[]
    createMany?: LocationCreateManyCampaignInputEnvelope
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
  }

  export type ObjectModelCreateNestedManyWithoutCampaignInput = {
    create?: XOR<ObjectModelCreateWithoutCampaignInput, ObjectModelUncheckedCreateWithoutCampaignInput> | ObjectModelCreateWithoutCampaignInput[] | ObjectModelUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: ObjectModelCreateOrConnectWithoutCampaignInput | ObjectModelCreateOrConnectWithoutCampaignInput[]
    createMany?: ObjectModelCreateManyCampaignInputEnvelope
    connect?: ObjectModelWhereUniqueInput | ObjectModelWhereUniqueInput[]
  }

  export type CharacterUncheckedCreateNestedManyWithoutCampaignInput = {
    create?: XOR<CharacterCreateWithoutCampaignInput, CharacterUncheckedCreateWithoutCampaignInput> | CharacterCreateWithoutCampaignInput[] | CharacterUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: CharacterCreateOrConnectWithoutCampaignInput | CharacterCreateOrConnectWithoutCampaignInput[]
    createMany?: CharacterCreateManyCampaignInputEnvelope
    connect?: CharacterWhereUniqueInput | CharacterWhereUniqueInput[]
  }

  export type EventUncheckedCreateNestedManyWithoutCampaignInput = {
    create?: XOR<EventCreateWithoutCampaignInput, EventUncheckedCreateWithoutCampaignInput> | EventCreateWithoutCampaignInput[] | EventUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: EventCreateOrConnectWithoutCampaignInput | EventCreateOrConnectWithoutCampaignInput[]
    createMany?: EventCreateManyCampaignInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type LocationUncheckedCreateNestedManyWithoutCampaignInput = {
    create?: XOR<LocationCreateWithoutCampaignInput, LocationUncheckedCreateWithoutCampaignInput> | LocationCreateWithoutCampaignInput[] | LocationUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutCampaignInput | LocationCreateOrConnectWithoutCampaignInput[]
    createMany?: LocationCreateManyCampaignInputEnvelope
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
  }

  export type ObjectModelUncheckedCreateNestedManyWithoutCampaignInput = {
    create?: XOR<ObjectModelCreateWithoutCampaignInput, ObjectModelUncheckedCreateWithoutCampaignInput> | ObjectModelCreateWithoutCampaignInput[] | ObjectModelUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: ObjectModelCreateOrConnectWithoutCampaignInput | ObjectModelCreateOrConnectWithoutCampaignInput[]
    createMany?: ObjectModelCreateManyCampaignInputEnvelope
    connect?: ObjectModelWhereUniqueInput | ObjectModelWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneRequiredWithoutCampaignsNestedInput = {
    create?: XOR<UserCreateWithoutCampaignsInput, UserUncheckedCreateWithoutCampaignsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCampaignsInput
    upsert?: UserUpsertWithoutCampaignsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCampaignsInput, UserUpdateWithoutCampaignsInput>, UserUncheckedUpdateWithoutCampaignsInput>
  }

  export type CharacterUpdateManyWithoutCampaignNestedInput = {
    create?: XOR<CharacterCreateWithoutCampaignInput, CharacterUncheckedCreateWithoutCampaignInput> | CharacterCreateWithoutCampaignInput[] | CharacterUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: CharacterCreateOrConnectWithoutCampaignInput | CharacterCreateOrConnectWithoutCampaignInput[]
    upsert?: CharacterUpsertWithWhereUniqueWithoutCampaignInput | CharacterUpsertWithWhereUniqueWithoutCampaignInput[]
    createMany?: CharacterCreateManyCampaignInputEnvelope
    set?: CharacterWhereUniqueInput | CharacterWhereUniqueInput[]
    disconnect?: CharacterWhereUniqueInput | CharacterWhereUniqueInput[]
    delete?: CharacterWhereUniqueInput | CharacterWhereUniqueInput[]
    connect?: CharacterWhereUniqueInput | CharacterWhereUniqueInput[]
    update?: CharacterUpdateWithWhereUniqueWithoutCampaignInput | CharacterUpdateWithWhereUniqueWithoutCampaignInput[]
    updateMany?: CharacterUpdateManyWithWhereWithoutCampaignInput | CharacterUpdateManyWithWhereWithoutCampaignInput[]
    deleteMany?: CharacterScalarWhereInput | CharacterScalarWhereInput[]
  }

  export type EventUpdateManyWithoutCampaignNestedInput = {
    create?: XOR<EventCreateWithoutCampaignInput, EventUncheckedCreateWithoutCampaignInput> | EventCreateWithoutCampaignInput[] | EventUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: EventCreateOrConnectWithoutCampaignInput | EventCreateOrConnectWithoutCampaignInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutCampaignInput | EventUpsertWithWhereUniqueWithoutCampaignInput[]
    createMany?: EventCreateManyCampaignInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutCampaignInput | EventUpdateWithWhereUniqueWithoutCampaignInput[]
    updateMany?: EventUpdateManyWithWhereWithoutCampaignInput | EventUpdateManyWithWhereWithoutCampaignInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type LocationUpdateManyWithoutCampaignNestedInput = {
    create?: XOR<LocationCreateWithoutCampaignInput, LocationUncheckedCreateWithoutCampaignInput> | LocationCreateWithoutCampaignInput[] | LocationUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutCampaignInput | LocationCreateOrConnectWithoutCampaignInput[]
    upsert?: LocationUpsertWithWhereUniqueWithoutCampaignInput | LocationUpsertWithWhereUniqueWithoutCampaignInput[]
    createMany?: LocationCreateManyCampaignInputEnvelope
    set?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    disconnect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    delete?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    update?: LocationUpdateWithWhereUniqueWithoutCampaignInput | LocationUpdateWithWhereUniqueWithoutCampaignInput[]
    updateMany?: LocationUpdateManyWithWhereWithoutCampaignInput | LocationUpdateManyWithWhereWithoutCampaignInput[]
    deleteMany?: LocationScalarWhereInput | LocationScalarWhereInput[]
  }

  export type ObjectModelUpdateManyWithoutCampaignNestedInput = {
    create?: XOR<ObjectModelCreateWithoutCampaignInput, ObjectModelUncheckedCreateWithoutCampaignInput> | ObjectModelCreateWithoutCampaignInput[] | ObjectModelUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: ObjectModelCreateOrConnectWithoutCampaignInput | ObjectModelCreateOrConnectWithoutCampaignInput[]
    upsert?: ObjectModelUpsertWithWhereUniqueWithoutCampaignInput | ObjectModelUpsertWithWhereUniqueWithoutCampaignInput[]
    createMany?: ObjectModelCreateManyCampaignInputEnvelope
    set?: ObjectModelWhereUniqueInput | ObjectModelWhereUniqueInput[]
    disconnect?: ObjectModelWhereUniqueInput | ObjectModelWhereUniqueInput[]
    delete?: ObjectModelWhereUniqueInput | ObjectModelWhereUniqueInput[]
    connect?: ObjectModelWhereUniqueInput | ObjectModelWhereUniqueInput[]
    update?: ObjectModelUpdateWithWhereUniqueWithoutCampaignInput | ObjectModelUpdateWithWhereUniqueWithoutCampaignInput[]
    updateMany?: ObjectModelUpdateManyWithWhereWithoutCampaignInput | ObjectModelUpdateManyWithWhereWithoutCampaignInput[]
    deleteMany?: ObjectModelScalarWhereInput | ObjectModelScalarWhereInput[]
  }

  export type CharacterUncheckedUpdateManyWithoutCampaignNestedInput = {
    create?: XOR<CharacterCreateWithoutCampaignInput, CharacterUncheckedCreateWithoutCampaignInput> | CharacterCreateWithoutCampaignInput[] | CharacterUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: CharacterCreateOrConnectWithoutCampaignInput | CharacterCreateOrConnectWithoutCampaignInput[]
    upsert?: CharacterUpsertWithWhereUniqueWithoutCampaignInput | CharacterUpsertWithWhereUniqueWithoutCampaignInput[]
    createMany?: CharacterCreateManyCampaignInputEnvelope
    set?: CharacterWhereUniqueInput | CharacterWhereUniqueInput[]
    disconnect?: CharacterWhereUniqueInput | CharacterWhereUniqueInput[]
    delete?: CharacterWhereUniqueInput | CharacterWhereUniqueInput[]
    connect?: CharacterWhereUniqueInput | CharacterWhereUniqueInput[]
    update?: CharacterUpdateWithWhereUniqueWithoutCampaignInput | CharacterUpdateWithWhereUniqueWithoutCampaignInput[]
    updateMany?: CharacterUpdateManyWithWhereWithoutCampaignInput | CharacterUpdateManyWithWhereWithoutCampaignInput[]
    deleteMany?: CharacterScalarWhereInput | CharacterScalarWhereInput[]
  }

  export type EventUncheckedUpdateManyWithoutCampaignNestedInput = {
    create?: XOR<EventCreateWithoutCampaignInput, EventUncheckedCreateWithoutCampaignInput> | EventCreateWithoutCampaignInput[] | EventUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: EventCreateOrConnectWithoutCampaignInput | EventCreateOrConnectWithoutCampaignInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutCampaignInput | EventUpsertWithWhereUniqueWithoutCampaignInput[]
    createMany?: EventCreateManyCampaignInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutCampaignInput | EventUpdateWithWhereUniqueWithoutCampaignInput[]
    updateMany?: EventUpdateManyWithWhereWithoutCampaignInput | EventUpdateManyWithWhereWithoutCampaignInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type LocationUncheckedUpdateManyWithoutCampaignNestedInput = {
    create?: XOR<LocationCreateWithoutCampaignInput, LocationUncheckedCreateWithoutCampaignInput> | LocationCreateWithoutCampaignInput[] | LocationUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutCampaignInput | LocationCreateOrConnectWithoutCampaignInput[]
    upsert?: LocationUpsertWithWhereUniqueWithoutCampaignInput | LocationUpsertWithWhereUniqueWithoutCampaignInput[]
    createMany?: LocationCreateManyCampaignInputEnvelope
    set?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    disconnect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    delete?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    update?: LocationUpdateWithWhereUniqueWithoutCampaignInput | LocationUpdateWithWhereUniqueWithoutCampaignInput[]
    updateMany?: LocationUpdateManyWithWhereWithoutCampaignInput | LocationUpdateManyWithWhereWithoutCampaignInput[]
    deleteMany?: LocationScalarWhereInput | LocationScalarWhereInput[]
  }

  export type ObjectModelUncheckedUpdateManyWithoutCampaignNestedInput = {
    create?: XOR<ObjectModelCreateWithoutCampaignInput, ObjectModelUncheckedCreateWithoutCampaignInput> | ObjectModelCreateWithoutCampaignInput[] | ObjectModelUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: ObjectModelCreateOrConnectWithoutCampaignInput | ObjectModelCreateOrConnectWithoutCampaignInput[]
    upsert?: ObjectModelUpsertWithWhereUniqueWithoutCampaignInput | ObjectModelUpsertWithWhereUniqueWithoutCampaignInput[]
    createMany?: ObjectModelCreateManyCampaignInputEnvelope
    set?: ObjectModelWhereUniqueInput | ObjectModelWhereUniqueInput[]
    disconnect?: ObjectModelWhereUniqueInput | ObjectModelWhereUniqueInput[]
    delete?: ObjectModelWhereUniqueInput | ObjectModelWhereUniqueInput[]
    connect?: ObjectModelWhereUniqueInput | ObjectModelWhereUniqueInput[]
    update?: ObjectModelUpdateWithWhereUniqueWithoutCampaignInput | ObjectModelUpdateWithWhereUniqueWithoutCampaignInput[]
    updateMany?: ObjectModelUpdateManyWithWhereWithoutCampaignInput | ObjectModelUpdateManyWithWhereWithoutCampaignInput[]
    deleteMany?: ObjectModelScalarWhereInput | ObjectModelScalarWhereInput[]
  }

  export type CampaignCreateNestedOneWithoutEventsInput = {
    create?: XOR<CampaignCreateWithoutEventsInput, CampaignUncheckedCreateWithoutEventsInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutEventsInput
    connect?: CampaignWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CampaignUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<CampaignCreateWithoutEventsInput, CampaignUncheckedCreateWithoutEventsInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutEventsInput
    upsert?: CampaignUpsertWithoutEventsInput
    connect?: CampaignWhereUniqueInput
    update?: XOR<XOR<CampaignUpdateToOneWithWhereWithoutEventsInput, CampaignUpdateWithoutEventsInput>, CampaignUncheckedUpdateWithoutEventsInput>
  }

  export type CampaignCreateNestedOneWithoutCharactersInput = {
    create?: XOR<CampaignCreateWithoutCharactersInput, CampaignUncheckedCreateWithoutCharactersInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutCharactersInput
    connect?: CampaignWhereUniqueInput
  }

  export type CampaignUpdateOneRequiredWithoutCharactersNestedInput = {
    create?: XOR<CampaignCreateWithoutCharactersInput, CampaignUncheckedCreateWithoutCharactersInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutCharactersInput
    upsert?: CampaignUpsertWithoutCharactersInput
    connect?: CampaignWhereUniqueInput
    update?: XOR<XOR<CampaignUpdateToOneWithWhereWithoutCharactersInput, CampaignUpdateWithoutCharactersInput>, CampaignUncheckedUpdateWithoutCharactersInput>
  }

  export type CampaignCreateNestedOneWithoutLocationsInput = {
    create?: XOR<CampaignCreateWithoutLocationsInput, CampaignUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutLocationsInput
    connect?: CampaignWhereUniqueInput
  }

  export type CampaignUpdateOneRequiredWithoutLocationsNestedInput = {
    create?: XOR<CampaignCreateWithoutLocationsInput, CampaignUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutLocationsInput
    upsert?: CampaignUpsertWithoutLocationsInput
    connect?: CampaignWhereUniqueInput
    update?: XOR<XOR<CampaignUpdateToOneWithWhereWithoutLocationsInput, CampaignUpdateWithoutLocationsInput>, CampaignUncheckedUpdateWithoutLocationsInput>
  }

  export type CampaignCreateNestedOneWithoutObjectsInput = {
    create?: XOR<CampaignCreateWithoutObjectsInput, CampaignUncheckedCreateWithoutObjectsInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutObjectsInput
    connect?: CampaignWhereUniqueInput
  }

  export type CampaignUpdateOneRequiredWithoutObjectsNestedInput = {
    create?: XOR<CampaignCreateWithoutObjectsInput, CampaignUncheckedCreateWithoutObjectsInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutObjectsInput
    upsert?: CampaignUpsertWithoutObjectsInput
    connect?: CampaignWhereUniqueInput
    update?: XOR<XOR<CampaignUpdateToOneWithWhereWithoutObjectsInput, CampaignUpdateWithoutObjectsInput>, CampaignUncheckedUpdateWithoutObjectsInput>
  }

  export type EnumNodeTypeFieldUpdateOperationsInput = {
    set?: $Enums.NodeType
  }

  export type EnumRelationTypeFieldUpdateOperationsInput = {
    set?: $Enums.RelationType
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumNodeTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NodeType | EnumNodeTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNodeTypeFilter<$PrismaModel> | $Enums.NodeType
  }

  export type NestedEnumRelationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RelationType | EnumRelationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RelationType[] | ListEnumRelationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RelationType[] | ListEnumRelationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRelationTypeFilter<$PrismaModel> | $Enums.RelationType
  }

  export type NestedEnumNodeTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NodeType | EnumNodeTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NodeType[] | ListEnumNodeTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNodeTypeWithAggregatesFilter<$PrismaModel> | $Enums.NodeType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNodeTypeFilter<$PrismaModel>
    _max?: NestedEnumNodeTypeFilter<$PrismaModel>
  }

  export type NestedEnumRelationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RelationType | EnumRelationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RelationType[] | ListEnumRelationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RelationType[] | ListEnumRelationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRelationTypeWithAggregatesFilter<$PrismaModel> | $Enums.RelationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRelationTypeFilter<$PrismaModel>
    _max?: NestedEnumRelationTypeFilter<$PrismaModel>
  }

  export type CampaignCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    imageUrl?: string | null
    characters?: CharacterCreateNestedManyWithoutCampaignInput
    events?: EventCreateNestedManyWithoutCampaignInput
    locations?: LocationCreateNestedManyWithoutCampaignInput
    objects?: ObjectModelCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    imageUrl?: string | null
    characters?: CharacterUncheckedCreateNestedManyWithoutCampaignInput
    events?: EventUncheckedCreateNestedManyWithoutCampaignInput
    locations?: LocationUncheckedCreateNestedManyWithoutCampaignInput
    objects?: ObjectModelUncheckedCreateNestedManyWithoutCampaignInput
  }

  export type CampaignCreateOrConnectWithoutUserInput = {
    where: CampaignWhereUniqueInput
    create: XOR<CampaignCreateWithoutUserInput, CampaignUncheckedCreateWithoutUserInput>
  }

  export type CampaignCreateManyUserInputEnvelope = {
    data: CampaignCreateManyUserInput | CampaignCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CampaignUpsertWithWhereUniqueWithoutUserInput = {
    where: CampaignWhereUniqueInput
    update: XOR<CampaignUpdateWithoutUserInput, CampaignUncheckedUpdateWithoutUserInput>
    create: XOR<CampaignCreateWithoutUserInput, CampaignUncheckedCreateWithoutUserInput>
  }

  export type CampaignUpdateWithWhereUniqueWithoutUserInput = {
    where: CampaignWhereUniqueInput
    data: XOR<CampaignUpdateWithoutUserInput, CampaignUncheckedUpdateWithoutUserInput>
  }

  export type CampaignUpdateManyWithWhereWithoutUserInput = {
    where: CampaignScalarWhereInput
    data: XOR<CampaignUpdateManyMutationInput, CampaignUncheckedUpdateManyWithoutUserInput>
  }

  export type CampaignScalarWhereInput = {
    AND?: CampaignScalarWhereInput | CampaignScalarWhereInput[]
    OR?: CampaignScalarWhereInput[]
    NOT?: CampaignScalarWhereInput | CampaignScalarWhereInput[]
    id?: StringFilter<"Campaign"> | string
    userId?: StringFilter<"Campaign"> | string
    name?: StringFilter<"Campaign"> | string
    description?: StringNullableFilter<"Campaign"> | string | null
    imageUrl?: StringNullableFilter<"Campaign"> | string | null
  }

  export type UserCreateWithoutCampaignsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
  }

  export type UserUncheckedCreateWithoutCampaignsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
  }

  export type UserCreateOrConnectWithoutCampaignsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCampaignsInput, UserUncheckedCreateWithoutCampaignsInput>
  }

  export type CharacterCreateWithoutCampaignInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type CharacterUncheckedCreateWithoutCampaignInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type CharacterCreateOrConnectWithoutCampaignInput = {
    where: CharacterWhereUniqueInput
    create: XOR<CharacterCreateWithoutCampaignInput, CharacterUncheckedCreateWithoutCampaignInput>
  }

  export type CharacterCreateManyCampaignInputEnvelope = {
    data: CharacterCreateManyCampaignInput | CharacterCreateManyCampaignInput[]
    skipDuplicates?: boolean
  }

  export type EventCreateWithoutCampaignInput = {
    id?: string
    title: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type EventUncheckedCreateWithoutCampaignInput = {
    id?: string
    title: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type EventCreateOrConnectWithoutCampaignInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutCampaignInput, EventUncheckedCreateWithoutCampaignInput>
  }

  export type EventCreateManyCampaignInputEnvelope = {
    data: EventCreateManyCampaignInput | EventCreateManyCampaignInput[]
    skipDuplicates?: boolean
  }

  export type LocationCreateWithoutCampaignInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type LocationUncheckedCreateWithoutCampaignInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type LocationCreateOrConnectWithoutCampaignInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutCampaignInput, LocationUncheckedCreateWithoutCampaignInput>
  }

  export type LocationCreateManyCampaignInputEnvelope = {
    data: LocationCreateManyCampaignInput | LocationCreateManyCampaignInput[]
    skipDuplicates?: boolean
  }

  export type ObjectModelCreateWithoutCampaignInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type ObjectModelUncheckedCreateWithoutCampaignInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type ObjectModelCreateOrConnectWithoutCampaignInput = {
    where: ObjectModelWhereUniqueInput
    create: XOR<ObjectModelCreateWithoutCampaignInput, ObjectModelUncheckedCreateWithoutCampaignInput>
  }

  export type ObjectModelCreateManyCampaignInputEnvelope = {
    data: ObjectModelCreateManyCampaignInput | ObjectModelCreateManyCampaignInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCampaignsInput = {
    update: XOR<UserUpdateWithoutCampaignsInput, UserUncheckedUpdateWithoutCampaignsInput>
    create: XOR<UserCreateWithoutCampaignsInput, UserUncheckedCreateWithoutCampaignsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCampaignsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCampaignsInput, UserUncheckedUpdateWithoutCampaignsInput>
  }

  export type UserUpdateWithoutCampaignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
  }

  export type UserUncheckedUpdateWithoutCampaignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
  }

  export type CharacterUpsertWithWhereUniqueWithoutCampaignInput = {
    where: CharacterWhereUniqueInput
    update: XOR<CharacterUpdateWithoutCampaignInput, CharacterUncheckedUpdateWithoutCampaignInput>
    create: XOR<CharacterCreateWithoutCampaignInput, CharacterUncheckedCreateWithoutCampaignInput>
  }

  export type CharacterUpdateWithWhereUniqueWithoutCampaignInput = {
    where: CharacterWhereUniqueInput
    data: XOR<CharacterUpdateWithoutCampaignInput, CharacterUncheckedUpdateWithoutCampaignInput>
  }

  export type CharacterUpdateManyWithWhereWithoutCampaignInput = {
    where: CharacterScalarWhereInput
    data: XOR<CharacterUpdateManyMutationInput, CharacterUncheckedUpdateManyWithoutCampaignInput>
  }

  export type CharacterScalarWhereInput = {
    AND?: CharacterScalarWhereInput | CharacterScalarWhereInput[]
    OR?: CharacterScalarWhereInput[]
    NOT?: CharacterScalarWhereInput | CharacterScalarWhereInput[]
    id?: StringFilter<"Character"> | string
    campaignId?: StringFilter<"Character"> | string
    name?: StringFilter<"Character"> | string
    description?: StringNullableFilter<"Character"> | string | null
    createdAt?: DateTimeFilter<"Character"> | Date | string
    imageUrl?: StringNullableFilter<"Character"> | string | null
  }

  export type EventUpsertWithWhereUniqueWithoutCampaignInput = {
    where: EventWhereUniqueInput
    update: XOR<EventUpdateWithoutCampaignInput, EventUncheckedUpdateWithoutCampaignInput>
    create: XOR<EventCreateWithoutCampaignInput, EventUncheckedCreateWithoutCampaignInput>
  }

  export type EventUpdateWithWhereUniqueWithoutCampaignInput = {
    where: EventWhereUniqueInput
    data: XOR<EventUpdateWithoutCampaignInput, EventUncheckedUpdateWithoutCampaignInput>
  }

  export type EventUpdateManyWithWhereWithoutCampaignInput = {
    where: EventScalarWhereInput
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyWithoutCampaignInput>
  }

  export type EventScalarWhereInput = {
    AND?: EventScalarWhereInput | EventScalarWhereInput[]
    OR?: EventScalarWhereInput[]
    NOT?: EventScalarWhereInput | EventScalarWhereInput[]
    id?: StringFilter<"Event"> | string
    campaignId?: StringFilter<"Event"> | string
    title?: StringFilter<"Event"> | string
    description?: StringNullableFilter<"Event"> | string | null
    createdAt?: DateTimeFilter<"Event"> | Date | string
    imageUrl?: StringNullableFilter<"Event"> | string | null
  }

  export type LocationUpsertWithWhereUniqueWithoutCampaignInput = {
    where: LocationWhereUniqueInput
    update: XOR<LocationUpdateWithoutCampaignInput, LocationUncheckedUpdateWithoutCampaignInput>
    create: XOR<LocationCreateWithoutCampaignInput, LocationUncheckedCreateWithoutCampaignInput>
  }

  export type LocationUpdateWithWhereUniqueWithoutCampaignInput = {
    where: LocationWhereUniqueInput
    data: XOR<LocationUpdateWithoutCampaignInput, LocationUncheckedUpdateWithoutCampaignInput>
  }

  export type LocationUpdateManyWithWhereWithoutCampaignInput = {
    where: LocationScalarWhereInput
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyWithoutCampaignInput>
  }

  export type LocationScalarWhereInput = {
    AND?: LocationScalarWhereInput | LocationScalarWhereInput[]
    OR?: LocationScalarWhereInput[]
    NOT?: LocationScalarWhereInput | LocationScalarWhereInput[]
    id?: StringFilter<"Location"> | string
    campaignId?: StringFilter<"Location"> | string
    name?: StringFilter<"Location"> | string
    description?: StringNullableFilter<"Location"> | string | null
    createdAt?: DateTimeFilter<"Location"> | Date | string
    imageUrl?: StringNullableFilter<"Location"> | string | null
  }

  export type ObjectModelUpsertWithWhereUniqueWithoutCampaignInput = {
    where: ObjectModelWhereUniqueInput
    update: XOR<ObjectModelUpdateWithoutCampaignInput, ObjectModelUncheckedUpdateWithoutCampaignInput>
    create: XOR<ObjectModelCreateWithoutCampaignInput, ObjectModelUncheckedCreateWithoutCampaignInput>
  }

  export type ObjectModelUpdateWithWhereUniqueWithoutCampaignInput = {
    where: ObjectModelWhereUniqueInput
    data: XOR<ObjectModelUpdateWithoutCampaignInput, ObjectModelUncheckedUpdateWithoutCampaignInput>
  }

  export type ObjectModelUpdateManyWithWhereWithoutCampaignInput = {
    where: ObjectModelScalarWhereInput
    data: XOR<ObjectModelUpdateManyMutationInput, ObjectModelUncheckedUpdateManyWithoutCampaignInput>
  }

  export type ObjectModelScalarWhereInput = {
    AND?: ObjectModelScalarWhereInput | ObjectModelScalarWhereInput[]
    OR?: ObjectModelScalarWhereInput[]
    NOT?: ObjectModelScalarWhereInput | ObjectModelScalarWhereInput[]
    id?: StringFilter<"ObjectModel"> | string
    campaignId?: StringFilter<"ObjectModel"> | string
    name?: StringFilter<"ObjectModel"> | string
    description?: StringNullableFilter<"ObjectModel"> | string | null
    createdAt?: DateTimeFilter<"ObjectModel"> | Date | string
    imageUrl?: StringNullableFilter<"ObjectModel"> | string | null
  }

  export type CampaignCreateWithoutEventsInput = {
    id?: string
    name: string
    description?: string | null
    imageUrl?: string | null
    user: UserCreateNestedOneWithoutCampaignsInput
    characters?: CharacterCreateNestedManyWithoutCampaignInput
    locations?: LocationCreateNestedManyWithoutCampaignInput
    objects?: ObjectModelCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUncheckedCreateWithoutEventsInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    imageUrl?: string | null
    characters?: CharacterUncheckedCreateNestedManyWithoutCampaignInput
    locations?: LocationUncheckedCreateNestedManyWithoutCampaignInput
    objects?: ObjectModelUncheckedCreateNestedManyWithoutCampaignInput
  }

  export type CampaignCreateOrConnectWithoutEventsInput = {
    where: CampaignWhereUniqueInput
    create: XOR<CampaignCreateWithoutEventsInput, CampaignUncheckedCreateWithoutEventsInput>
  }

  export type CampaignUpsertWithoutEventsInput = {
    update: XOR<CampaignUpdateWithoutEventsInput, CampaignUncheckedUpdateWithoutEventsInput>
    create: XOR<CampaignCreateWithoutEventsInput, CampaignUncheckedCreateWithoutEventsInput>
    where?: CampaignWhereInput
  }

  export type CampaignUpdateToOneWithWhereWithoutEventsInput = {
    where?: CampaignWhereInput
    data: XOR<CampaignUpdateWithoutEventsInput, CampaignUncheckedUpdateWithoutEventsInput>
  }

  export type CampaignUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutCampaignsNestedInput
    characters?: CharacterUpdateManyWithoutCampaignNestedInput
    locations?: LocationUpdateManyWithoutCampaignNestedInput
    objects?: ObjectModelUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    characters?: CharacterUncheckedUpdateManyWithoutCampaignNestedInput
    locations?: LocationUncheckedUpdateManyWithoutCampaignNestedInput
    objects?: ObjectModelUncheckedUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignCreateWithoutCharactersInput = {
    id?: string
    name: string
    description?: string | null
    imageUrl?: string | null
    user: UserCreateNestedOneWithoutCampaignsInput
    events?: EventCreateNestedManyWithoutCampaignInput
    locations?: LocationCreateNestedManyWithoutCampaignInput
    objects?: ObjectModelCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUncheckedCreateWithoutCharactersInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    imageUrl?: string | null
    events?: EventUncheckedCreateNestedManyWithoutCampaignInput
    locations?: LocationUncheckedCreateNestedManyWithoutCampaignInput
    objects?: ObjectModelUncheckedCreateNestedManyWithoutCampaignInput
  }

  export type CampaignCreateOrConnectWithoutCharactersInput = {
    where: CampaignWhereUniqueInput
    create: XOR<CampaignCreateWithoutCharactersInput, CampaignUncheckedCreateWithoutCharactersInput>
  }

  export type CampaignUpsertWithoutCharactersInput = {
    update: XOR<CampaignUpdateWithoutCharactersInput, CampaignUncheckedUpdateWithoutCharactersInput>
    create: XOR<CampaignCreateWithoutCharactersInput, CampaignUncheckedCreateWithoutCharactersInput>
    where?: CampaignWhereInput
  }

  export type CampaignUpdateToOneWithWhereWithoutCharactersInput = {
    where?: CampaignWhereInput
    data: XOR<CampaignUpdateWithoutCharactersInput, CampaignUncheckedUpdateWithoutCharactersInput>
  }

  export type CampaignUpdateWithoutCharactersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutCampaignsNestedInput
    events?: EventUpdateManyWithoutCampaignNestedInput
    locations?: LocationUpdateManyWithoutCampaignNestedInput
    objects?: ObjectModelUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateWithoutCharactersInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    events?: EventUncheckedUpdateManyWithoutCampaignNestedInput
    locations?: LocationUncheckedUpdateManyWithoutCampaignNestedInput
    objects?: ObjectModelUncheckedUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignCreateWithoutLocationsInput = {
    id?: string
    name: string
    description?: string | null
    imageUrl?: string | null
    user: UserCreateNestedOneWithoutCampaignsInput
    characters?: CharacterCreateNestedManyWithoutCampaignInput
    events?: EventCreateNestedManyWithoutCampaignInput
    objects?: ObjectModelCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUncheckedCreateWithoutLocationsInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    imageUrl?: string | null
    characters?: CharacterUncheckedCreateNestedManyWithoutCampaignInput
    events?: EventUncheckedCreateNestedManyWithoutCampaignInput
    objects?: ObjectModelUncheckedCreateNestedManyWithoutCampaignInput
  }

  export type CampaignCreateOrConnectWithoutLocationsInput = {
    where: CampaignWhereUniqueInput
    create: XOR<CampaignCreateWithoutLocationsInput, CampaignUncheckedCreateWithoutLocationsInput>
  }

  export type CampaignUpsertWithoutLocationsInput = {
    update: XOR<CampaignUpdateWithoutLocationsInput, CampaignUncheckedUpdateWithoutLocationsInput>
    create: XOR<CampaignCreateWithoutLocationsInput, CampaignUncheckedCreateWithoutLocationsInput>
    where?: CampaignWhereInput
  }

  export type CampaignUpdateToOneWithWhereWithoutLocationsInput = {
    where?: CampaignWhereInput
    data: XOR<CampaignUpdateWithoutLocationsInput, CampaignUncheckedUpdateWithoutLocationsInput>
  }

  export type CampaignUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutCampaignsNestedInput
    characters?: CharacterUpdateManyWithoutCampaignNestedInput
    events?: EventUpdateManyWithoutCampaignNestedInput
    objects?: ObjectModelUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    characters?: CharacterUncheckedUpdateManyWithoutCampaignNestedInput
    events?: EventUncheckedUpdateManyWithoutCampaignNestedInput
    objects?: ObjectModelUncheckedUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignCreateWithoutObjectsInput = {
    id?: string
    name: string
    description?: string | null
    imageUrl?: string | null
    user: UserCreateNestedOneWithoutCampaignsInput
    characters?: CharacterCreateNestedManyWithoutCampaignInput
    events?: EventCreateNestedManyWithoutCampaignInput
    locations?: LocationCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUncheckedCreateWithoutObjectsInput = {
    id?: string
    userId: string
    name: string
    description?: string | null
    imageUrl?: string | null
    characters?: CharacterUncheckedCreateNestedManyWithoutCampaignInput
    events?: EventUncheckedCreateNestedManyWithoutCampaignInput
    locations?: LocationUncheckedCreateNestedManyWithoutCampaignInput
  }

  export type CampaignCreateOrConnectWithoutObjectsInput = {
    where: CampaignWhereUniqueInput
    create: XOR<CampaignCreateWithoutObjectsInput, CampaignUncheckedCreateWithoutObjectsInput>
  }

  export type CampaignUpsertWithoutObjectsInput = {
    update: XOR<CampaignUpdateWithoutObjectsInput, CampaignUncheckedUpdateWithoutObjectsInput>
    create: XOR<CampaignCreateWithoutObjectsInput, CampaignUncheckedCreateWithoutObjectsInput>
    where?: CampaignWhereInput
  }

  export type CampaignUpdateToOneWithWhereWithoutObjectsInput = {
    where?: CampaignWhereInput
    data: XOR<CampaignUpdateWithoutObjectsInput, CampaignUncheckedUpdateWithoutObjectsInput>
  }

  export type CampaignUpdateWithoutObjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutCampaignsNestedInput
    characters?: CharacterUpdateManyWithoutCampaignNestedInput
    events?: EventUpdateManyWithoutCampaignNestedInput
    locations?: LocationUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateWithoutObjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    characters?: CharacterUncheckedUpdateManyWithoutCampaignNestedInput
    events?: EventUncheckedUpdateManyWithoutCampaignNestedInput
    locations?: LocationUncheckedUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignCreateManyUserInput = {
    id?: string
    name: string
    description?: string | null
    imageUrl?: string | null
  }

  export type CampaignUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    characters?: CharacterUpdateManyWithoutCampaignNestedInput
    events?: EventUpdateManyWithoutCampaignNestedInput
    locations?: LocationUpdateManyWithoutCampaignNestedInput
    objects?: ObjectModelUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    characters?: CharacterUncheckedUpdateManyWithoutCampaignNestedInput
    events?: EventUncheckedUpdateManyWithoutCampaignNestedInput
    locations?: LocationUncheckedUpdateManyWithoutCampaignNestedInput
    objects?: ObjectModelUncheckedUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CharacterCreateManyCampaignInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type EventCreateManyCampaignInput = {
    id?: string
    title: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type LocationCreateManyCampaignInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type ObjectModelCreateManyCampaignInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    imageUrl?: string | null
  }

  export type CharacterUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CharacterUncheckedUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CharacterUncheckedUpdateManyWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventUncheckedUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventUncheckedUpdateManyWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocationUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocationUncheckedUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocationUncheckedUpdateManyWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ObjectModelUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ObjectModelUncheckedUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ObjectModelUncheckedUpdateManyWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}