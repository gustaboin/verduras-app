export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      calidades: {
        Row: {
          id: number
          nombre: string
        }
        Insert: {
          id?: never
          nombre: string
        }
        Update: {
          id?: never
          nombre?: string
        }
        Relationships: []
      }
      cargas_viaje: {
        Row: {
          cantidad_cargada: number
          created_at: string | null
          id: number
          pedido_item_id: number
          viaje_id: number
        }
        Insert: {
          cantidad_cargada: number
          created_at?: string | null
          id?: never
          pedido_item_id: number
          viaje_id: number
        }
        Update: {
          cantidad_cargada?: number
          created_at?: string | null
          id?: never
          pedido_item_id?: number
          viaje_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cargas_viaje_pedido_item_id_fkey"
            columns: ["pedido_item_id"]
            isOneToOne: false
            referencedRelation: "pedido_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargas_viaje_viaje_id_fkey"
            columns: ["viaje_id"]
            isOneToOne: false
            referencedRelation: "viajes"
            referencedColumns: ["id"]
          },
        ]
      }
      choferes: {
        Row: {
          activo: boolean | null
          id: number
          licencia: string | null
          nombre: string
          telefono: string | null
          transportista_id: number | null
        }
        Insert: {
          activo?: boolean | null
          id?: never
          licencia?: string | null
          nombre: string
          telefono?: string | null
          transportista_id?: number | null
        }
        Update: {
          activo?: boolean | null
          id?: never
          licencia?: string | null
          nombre?: string
          telefono?: string | null
          transportista_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "choferes_transportista_id_fkey"
            columns: ["transportista_id"]
            isOneToOne: false
            referencedRelation: "transportes"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          calle: string
          codigo_postal: string
          created_at: string | null
          depto: string | null
          email: string | null
          estado: string
          id: string
          localidad: string
          nrodoc: string
          numero: string | null
          provincia: string
          puesto_id: number | null
          razon_social: string
          referencias_entrega: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          calle: string
          codigo_postal: string
          created_at?: string | null
          depto?: string | null
          email?: string | null
          estado?: string
          id?: string
          localidad: string
          nrodoc: string
          numero?: string | null
          provincia: string
          puesto_id?: number | null
          razon_social: string
          referencias_entrega?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          calle?: string
          codigo_postal?: string
          created_at?: string | null
          depto?: string | null
          email?: string | null
          estado?: string
          id?: string
          localidad?: string
          nrodoc?: string
          numero?: string | null
          provincia?: string
          puesto_id?: number | null
          razon_social?: string
          referencias_entrega?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_puesto_id_fkey"
            columns: ["puesto_id"]
            isOneToOne: false
            referencedRelation: "puestos"
            referencedColumns: ["id"]
          },
        ]
      }
      devoluciones: {
        Row: {
          cantidad: number
          created_at: string | null
          id: number
          motivo: string | null
          pedido_item_id: number
        }
        Insert: {
          cantidad: number
          created_at?: string | null
          id?: never
          motivo?: string | null
          pedido_item_id: number
        }
        Update: {
          cantidad?: number
          created_at?: string | null
          id?: never
          motivo?: string | null
          pedido_item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "devoluciones_pedido_item_id_fkey"
            columns: ["pedido_item_id"]
            isOneToOne: false
            referencedRelation: "pedido_items"
            referencedColumns: ["id"]
          },
        ]
      }
      mercados: {
        Row: {
          activo: boolean | null
          ciudad: string | null
          id: number
          nombre: string
          provincia: string | null
        }
        Insert: {
          activo?: boolean | null
          ciudad?: string | null
          id?: never
          nombre: string
          provincia?: string | null
        }
        Update: {
          activo?: boolean | null
          ciudad?: string | null
          id?: never
          nombre?: string
          provincia?: string | null
        }
        Relationships: []
      }
      pedido_items: {
        Row: {
          calidad_enviada_id: number | null
          calidad_requerida_id: number | null
          cantidad: number
          cantidad_enviada: number
          created_at: string | null
          es_recortable: boolean
          id: number
          pedido_id: string
          producto_presentacion_id: number
        }
        Insert: {
          calidad_enviada_id?: number | null
          calidad_requerida_id?: number | null
          cantidad: number
          cantidad_enviada?: number
          created_at?: string | null
          es_recortable?: boolean
          id?: never
          pedido_id: string
          producto_presentacion_id: number
        }
        Update: {
          calidad_enviada_id?: number | null
          calidad_requerida_id?: number | null
          cantidad?: number
          cantidad_enviada?: number
          created_at?: string | null
          es_recortable?: boolean
          id?: never
          pedido_id?: string
          producto_presentacion_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedido_items_calidad_enviada_id_fkey"
            columns: ["calidad_enviada_id"]
            isOneToOne: false
            referencedRelation: "calidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_items_calidad_requerida_id_fkey"
            columns: ["calidad_requerida_id"]
            isOneToOne: false
            referencedRelation: "calidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_items_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_items_producto_presentacion_id_fkey"
            columns: ["producto_presentacion_id"]
            isOneToOne: false
            referencedRelation: "productos_presentacion"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_viajes: {
        Row: {
          created_at: string | null
          estado: string
          id: number
          pedido_id: string
          viaje_id: number
        }
        Insert: {
          created_at?: string | null
          estado?: string
          id?: never
          pedido_id: string
          viaje_id: number
        }
        Update: {
          created_at?: string | null
          estado?: string
          id?: never
          pedido_id?: string
          viaje_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedido_viajes_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_viajes_viaje_id_fkey"
            columns: ["viaje_id"]
            isOneToOne: false
            referencedRelation: "viajes"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente_id: string
          codigo: string | null
          created_at: string | null
          estado: string
          fecha_compromiso: string | null
          fecha_pedido: string
          id: string
          observaciones: string | null
          puesto_id: number | null
        }
        Insert: {
          cliente_id: string
          codigo?: string | null
          created_at?: string | null
          estado?: string
          fecha_compromiso?: string | null
          fecha_pedido?: string
          id?: string
          observaciones?: string | null
          puesto_id?: number | null
        }
        Update: {
          cliente_id?: string
          codigo?: string | null
          created_at?: string | null
          estado?: string
          fecha_compromiso?: string | null
          fecha_pedido?: string
          id?: string
          observaciones?: string | null
          puesto_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_puesto_id_fkey"
            columns: ["puesto_id"]
            isOneToOne: false
            referencedRelation: "puestos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          descripcion: string | null
          id: number
          nombre: string
          padre_id: number | null
        }
        Insert: {
          descripcion?: string | null
          id?: never
          nombre: string
          padre_id?: number | null
        }
        Update: {
          descripcion?: string | null
          id?: never
          nombre?: string
          padre_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_padre_id_fkey"
            columns: ["padre_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos_presentacion: {
        Row: {
          calidad_id: number | null
          descripcion: string | null
          envase_id: number | null
          id: number
          kg_por_unidad: number | null
          producto_id: number
          unidad_id: number | null
          unidades_por_envase: number | null
        }
        Insert: {
          calidad_id?: number | null
          descripcion?: string | null
          envase_id?: number | null
          id?: never
          kg_por_unidad?: number | null
          producto_id: number
          unidad_id?: number | null
          unidades_por_envase?: number | null
        }
        Update: {
          calidad_id?: number | null
          descripcion?: string | null
          envase_id?: number | null
          id?: never
          kg_por_unidad?: number | null
          producto_id?: number
          unidad_id?: number | null
          unidades_por_envase?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_presentacion_calidad_id_fkey"
            columns: ["calidad_id"]
            isOneToOne: false
            referencedRelation: "calidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_presentacion_envase_id_fkey"
            columns: ["envase_id"]
            isOneToOne: false
            referencedRelation: "tipos_envase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_presentacion_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_presentacion_unidad_id_fkey"
            columns: ["unidad_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      puestos: {
        Row: {
          codigo_puesto: string
          descripcion: string | null
          id: number
          mercado_id: number
        }
        Insert: {
          codigo_puesto: string
          descripcion?: string | null
          id?: never
          mercado_id: number
        }
        Update: {
          codigo_puesto?: string
          descripcion?: string | null
          id?: never
          mercado_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "puestos_mercado_id_fkey"
            columns: ["mercado_id"]
            isOneToOne: false
            referencedRelation: "mercados"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_envase: {
        Row: {
          id: number
          nombre: string
        }
        Insert: {
          id?: never
          nombre: string
        }
        Update: {
          id?: never
          nombre?: string
        }
        Relationships: []
      }
      tipos_vehiculo: {
        Row: {
          capacidad_kg: number | null
          capacidad_pallets: number | null
          id: number
          nombre: string
        }
        Insert: {
          capacidad_kg?: number | null
          capacidad_pallets?: number | null
          id?: never
          nombre: string
        }
        Update: {
          capacidad_kg?: number | null
          capacidad_pallets?: number | null
          id?: never
          nombre?: string
        }
        Relationships: []
      }
      transportes: {
        Row: {
          activo: boolean | null
          id: number
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          id?: never
          nombre: string
        }
        Update: {
          activo?: boolean | null
          id?: never
          nombre?: string
        }
        Relationships: []
      }
      unidades: {
        Row: {
          abreviatura: string | null
          id: number
          nombre: string
        }
        Insert: {
          abreviatura?: string | null
          id?: never
          nombre: string
        }
        Update: {
          abreviatura?: string | null
          id?: never
          nombre?: string
        }
        Relationships: []
      }
      vehiculos: {
        Row: {
          activo: boolean | null
          descripcion: string | null
          id: number
          patente: string
          tipo_vehiculo_id: number | null
          transportista_id: number | null
        }
        Insert: {
          activo?: boolean | null
          descripcion?: string | null
          id?: never
          patente: string
          tipo_vehiculo_id?: number | null
          transportista_id?: number | null
        }
        Update: {
          activo?: boolean | null
          descripcion?: string | null
          id?: never
          patente?: string
          tipo_vehiculo_id?: number | null
          transportista_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehiculos_tipo_vehiculo_id_fkey"
            columns: ["tipo_vehiculo_id"]
            isOneToOne: false
            referencedRelation: "tipos_vehiculo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehiculos_transportista_id_fkey"
            columns: ["transportista_id"]
            isOneToOne: false
            referencedRelation: "transportes"
            referencedColumns: ["id"]
          },
        ]
      }
      viajes: {
        Row: {
          campo_id: number | null
          chofer_id: number | null
          estado: string
          fecha: string | null
          id: number
          observaciones: string | null
          transportista_id: number | null
          vehiculo_id: number | null
        }
        Insert: {
          campo_id?: number | null
          chofer_id?: number | null
          estado?: string
          fecha?: string | null
          id?: never
          observaciones?: string | null
          transportista_id?: number | null
          vehiculo_id?: number | null
        }
        Update: {
          campo_id?: number | null
          chofer_id?: number | null
          estado?: string
          fecha?: string | null
          id?: never
          observaciones?: string | null
          transportista_id?: number | null
          vehiculo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "viajes_chofer_id_fkey"
            columns: ["chofer_id"]
            isOneToOne: false
            referencedRelation: "choferes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viajes_transportista_id_fkey"
            columns: ["transportista_id"]
            isOneToOne: false
            referencedRelation: "transportes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viajes_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
