export interface JsonApiResource<TAttributes, TRelationships = Record<string, never>> {
  id: string;
  type: string;
  attributes: TAttributes;
  relationships?: TRelationships;
}

export interface Relationship<T = { id: string }> {
  data: T | null;
}

export interface VehicleAttributes {
  label: string | null;
  current_status: "IN_TRANSIT_TO" | "STOPPED_AT" | "INCOMING_AT" | string | null;
  latitude: number | null;
  longitude: number | null;
  updated_at: string | null;
  speed: number | null;
  bearing: number | null;
  occupancy_status?: string | null;
  direction_id?: number | null;
}

export interface VehicleRelationships {
  route?: Relationship;
  trip?: Relationship;
  stop?: Relationship;
}

export type Vehicle = JsonApiResource<VehicleAttributes, VehicleRelationships>;

export interface RouteAttributes {
  long_name: string;
  short_name: string;
  type: number;
  color?: string | null;
  text_color?: string | null;
  description?: string | null;
}

export type Route = JsonApiResource<RouteAttributes>;

export interface TripAttributes {
  name: string | null;
  headsign: string | null;
  direction_id: number | null;
  wheelchair_accessible?: number | null;
  bikes_allowed?: number | null;
}

export interface TripRelationships {
  route?: Relationship;
  service?: Relationship;
  shape?: Relationship;
}

export type Trip = JsonApiResource<TripAttributes, TripRelationships>;

export interface JsonApiResponse<T> {
  data: T;
  included?: Array<JsonApiResource<Record<string, unknown>>>;
  links?: {
    self?: string;
    first?: string;
    last?: string;
    next?: string | null;
    prev?: string | null;
  };
  meta?: {
    pagination?: {
      total?: number;
      limit?: number;
      offset?: number;
    };
  };
}

export interface PageResult<T> {
  data: T[];
  total: number | null;
  hasNext: boolean;
}
