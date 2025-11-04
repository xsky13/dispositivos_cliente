export type Dispositivo = {
    id: number,
    name: string,
    descripcion: string,
    state: string,
    type: string,
    schemaJson: Record<string, any>;
}