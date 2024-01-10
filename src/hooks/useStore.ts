import { useMemo } from "react";

const stores = require("@/mock/stores.json")

function decimalToDMS(deg: number): string {
    const degrees = Math.floor(deg);
    const minutesDecimal = (deg - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = ((minutesDecimal - minutes) * 60).toFixed(2);

    return `${degrees}° ${minutes}' ${seconds}"`;
}

function convertLatLongToDMS(latitude: number, longitude: number): string {
    const latDirection = latitude >= 0 ? 'N' : 'S';
    const longDirection = longitude >= 0 ? 'E' : 'W';

    const latDMS = decimalToDMS(Math.abs(latitude)) + ` ${latDirection}`;
    const longDMS = decimalToDMS(Math.abs(longitude)) + ` ${longDirection}`;

    return latDMS + '\t' + longDMS;
}
export default function useStore() {
    const { title, msid, address1, address2, person, lat, lng } = useMemo(() => {
        const { name, msid, address1, address2, person, latlng } = stores[0]
        const [lat, lng] = latlng
        const [rlat, rlng] = convertLatLongToDMS(lat, lng).split("\t")
        return { title: name, msid, address1, address2, person, lat: rlat, lng: rlng }
    }, [])

    return { title, msid, address1, address2, person, lat, lng }
}