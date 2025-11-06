import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('sucursales', "routes/sucursales.tsx"),
    route('dispositivo/:dispositivoId', 'routes/dispositivo.tsx'),
    route('notificaciones', 'routes/notificaciones.tsx')] satisfies RouteConfig;
