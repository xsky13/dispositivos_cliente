export type Alerta = {
    id: number;
    deviceId: number;
    message: string;
    nivel: string;
    deviceExists: boolean;
    timestamp: string;
    andlerUsers: number[];
}