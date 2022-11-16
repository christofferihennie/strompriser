import {redirect} from '@sveltejs/kit';

interface StromLoad {
    NOK_per_kWh: number;
    EUR_per_kWH: number;
    EXR: number;
    time_start: string;
    time_end: string;
}

const leggTilMVA = (pris: number): number => {
    return pris * 1.25 * 100 + 1
}

const updateObject = (obj: StromLoad) => {
    return {
        ore_per_kWh: leggTilMVA(obj.NOK_per_kWh),
        start: new Date(obj.time_start).getHours(),
        end: new Date(obj.time_end).getHours()
    }
}

export const load = async ({params}) => {
    
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    const response = await fetch(`https://www.hvakosterstrommen.no/api/v1/prices/${today.getFullYear()}/${month}-${day}_${params.slug ? params.slug : 'NO1'}.json`)

    const data = await response.json();

    const updated = Object.values(data).map((el: any) => updateObject(el))

    return {region: (params.slug ? params.slug : 'NO1'), day: `${day}/${month}/${year}`, graph_data: updated}
}