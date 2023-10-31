let getParamsFromForm = () => {

    const cad_period = parseInt(document.getElementById("cad_period").value); // [ms]
    const cad_sf = parseInt(document.getElementById("cad_sf").value); 

    const is_2nd_ch_active = parseInt(document.getElementById("is_2nd_ch_active").value);
    const cad_sf2 = parseInt(document.getElementById("cad_sf2").value);

    const false_wor_detect_percent = parseInt(document.getElementById("false_wor_detect_percent").value)/100; // [%]

    const relay_to_gw_sf = parseInt(document.getElementById("relay_to_gw_sf").value);
    const gw_to_relay_sf = parseInt(document.getElementById("gw_to_relay_sf").value);

    const relay_battery_type = document.getElementById("relay_battery_type").value;
    const relay_battery_count = parseInt(document.getElementById("relay_battery_count").value);

    const ed_count = parseInt(document.getElementById("ed_count").value);

    const ed_ul_sf = parseInt(document.getElementById("ed_ul_sf").value);
    const ed_ul_per_day = parseInt(document.getElementById("ed_ul_day").value);
    const ed_ul_size = parseInt(document.getElementById("ed_ul_size").value); // [bytes]

    const ed_dl_sf = parseInt(document.getElementById("ed_dl_sf").value);
    const ed_dl_per_day = parseInt(document.getElementById("ed_dl_day").value);
    const ed_dl_size = parseInt(document.getElementById("ed_dl_size").value); // [bytes]

    const ed_battery_type = document.getElementById("ed_battery_type").value;
    const ed_battery_count = parseInt(document.getElementById("ed_battery_count").value);

    return {
        cad_period, cad_sf, 
        is_2nd_ch_active, cad_sf2, 
        false_wor_detect_percent, 
        relay_to_gw_sf, gw_to_relay_sf,
        relay_battery_type, relay_battery_count, 
        ed_count,
        ed_ul_sf, ed_ul_per_day, ed_ul_size,
        ed_dl_sf, ed_dl_per_day, ed_dl_size,
        ed_battery_type, ed_battery_count
    }

}