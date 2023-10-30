// ******************************************************
// * CONSTANTS                                          
// ******************************************************

const BATTERY_VOLTAGE = 3_300;    // mV

const RADIO_TX_CURRENT = 28_000;  // uA    +14 dBm
const RADIO_RX_CURRENT = 7_000;   // uA    Radio + TCXO
const RADIO_SLEEP_CURRENT = 1;    // uA
const TCXO_CURRENT = 1_000;       // uA
const TCXO_STARTUP_TIME = 4;      // ms

const UC_ACTIVE_CURRENT = 10_000; // uA
const UC_SLEEP_CURRENT = 3;       // uA
const UC_WAKEUP_TIME = 4;         // ms

const BATTERY_LEAK_PERCENT_PER_MONTH     = 0     // 0.003; // % of remaining capacity is lost per month
const BATTERY_PRACTICAL_CAPACITY_PARCENT = 0.7;  // only 70% of nominal battery capacity can be utilized
const BATTERY_LEAK_CURRENT               = 3;    // [uA]

// Crystal accuracy in parts per million (ppm)
const PPM_DRIFT = 60;

// Time on air of LoRa symbols with 125 kHz bandwidth
// [ms]
const TOA_SYMBOL_125 = {
    "SF7":  1.024,    // [ms]
    "SF8":  2.048,
    "SF9":  4.096,
    "SF10": 8.192,
    "SF11": 16.384,
    "SF12": 32.768,
}

// Time on air of Wake on Radio (WOR) Frames with 
//     - 14 bytes content
//     - 6 symbols preamle 
//     - 125 kHz bandwidth
// [ms]
const TOA_WOR_125 = {
    "SF7":  44.256,    // [ms]
    "SF8":  88.512,
    "SF9":  156.624,
    "SF10": 313.348,
    "SF11": 544.696,
    "SF12": 1089.492,
}

// Time on air of Wake on Radio (WOR) Frames with 
//     - 14 bytes content 
//     - 12 symbols preamle 
//     - 125 kHz bandwidth
// [ms]
const TOA_WOR_14B_12S_125 = {
    "SF7":   50.4,     // [ms]
    "SF8":   100.8,
    "SF9":   181.2,
    "SF10":  362.5,
    "SF11":  643, 
    "SF12":  1286.1,
};


// Time on air of WOR Acknowledgment Frames with 
//     - 6 bytes content
//     - 125 kHz bandwidth
// [ms]
const TOA_ACK_125 = {
    "SF7":  35,       // [ms]
    "SF8":  70.1,
    "SF9":  119.8,
    "SF10": 239.6,
    "SF11": 479.2,
    "SF12": 958.4,
};

// Time on air of LoRaWAN Data Frames with 
//     - 125 kHz bandwidth
// [ms]
const TOA_DATA_125 = {
    
    // Data Length: 20 bytes
    "SF7DL20":  60,     // [ms]
    "SF8DL20":  102,
    "SF9DL20":  200,
    "SF10DL20": 370,
    "SF11DL20": 660,
    "SF12DL20": 1319,

    // Data Length: 50 bytes
    "SF7DL50":  101,    // [ms]
    "SF8DL50":  174, 
    "SF9DL50":  345, 
    "SF10DL50":  617,  
    "SF11DL50":  1150, 
    "SF12DL50":  2139,
    
    // Data Length: 100 bytes
    "SF7DL100":  175,   // [ms]
    "SF8DL100":  308, 
    "SF9DL100":  554, 
    "SF10DL100":  1026, 
    "SF11DL100":  1889, 
    "SF12DL100":  3449,

    // Data Length: 150 bytes
    "SF7DL150":  250,   // [ms]
    "SF8DL150":  431, 
    "SF9DL150":  795, 
    "SF10DL150":  1436, 
    "SF11DL150":  2625, 
    "SF12DL150":  4760,
};

// Number of LoRa symbols of a CAD
const CAD_SYMBOLS_125 = {
    "SF7":  2,
    "SF8":  2,
    "SF9":  2,
    "SF10": 2,
    "SF11": 2,
    "SF12": 2,
};

// Battery options
const BATTERY = {
    "SAFT_LS14500": {
        nominal_capacity: 2.6, // Ah
        power: 7_488           // mWh
    }, 
    "AA_Energizer_Ultimate": {
        nominal_capacity: 3,   // Ah
        power: 3_600           // mWh
    }, 
    "SAFT_LS17330": {
        nominal_capacity: 2.1, // Ah
        power: 6_048           // mWh
    }, 
    "SAFT_LS_33600": {
        nominal_capacity: 17,  // Ah
        power: 48_960          // mWh
    }, 
    "SAFT_LS_26500": {
        nominal_capacity: 7.7, // Ah
        power: 22_176          // mWh
    },
};


// HELPER FUNCTIONS

let max = (a, b) => a > b ? a : b; 
let min = (a, b) => a > b ? b : a;


// CALCULATIONS

let calculate = () => {

    // ***********************************
    // * GET PARAMS FROM FORM
    // ***********************************

    const {
        cad_period,          // the time between Channel Activity Detections (CAD) [ms]
        cad_sf,              // the Spreading Factor (SF) of Channel Activity Detections (the SF of Wake on Radio signals)
        is_2nd_ch_active,    // 0 if 2nd CAD channel is disabled, 1 if enabled
        cad_sf2,             // the SF of the 2nd CAD channel
        false_wor_detect_percent,  // the ratio of fals Wake on Radio detections [%]
        relay_to_gw_sf,      // the SF used for sending frames from Relay to Gateway
        gw_to_relay_sf,      // the SF used for sending frames from the Gateway to Relay
        relay_battery_type,  // the type of the battery of the Relay
        relay_battery_count, // the number of batteries in the Relay
        ed_count,            // the number of relayed End-devices managed by the Relay
        ed_ul_sf,            // the SF used to send Uplink messages from an End-devices
        ed_ul_day,           // the number of Uplink messages sent by an End-device on a day
        ed_ul_size,          // the size of Uplink messages sent by an End-device [bytes]
        ed_dl_sf,            // the SF used to send Downlink messages from an End-device
        ed_dl_day,           // the number of Downlink messages sent by an End-device on a day 
        ed_dl_size,          // the size of Downlink messages sent by an End-device [bytes]
        ed_battery_type,     // the type of the battery of End-devices
        ed_battery_count     // the number of batteries in an End-device
    } = getParamsFromForm();


    // ***********************************
    // * CALCULATE RELAY RESULTS
    // ***********************************

    // number of CAD in a day 
    let cad_per_day = 24*60*60*1000 / cad_period;

    // number of symbols per a CAD in the default CAD channel
    let cad_symbols = CAD_SYMBOLS_125["SF"+cad_sf];

    // number of symbols per a CAD in the 2nd CAD channel
    let cad_symbols2 = CAD_SYMBOLS_125["SF"+cad_sf2];

    // time between Uplink frames sent by a relayed End-device [ms]
    let ed_ul_period = 24*60*60*1000 / ed_ul_day;
    
    // Time of the CAD of the default CAD channel [ms]
    let toa_cad = TOA_SYMBOL_125["SF"+cad_sf] * cad_symbols;

    // Time of the CAD of the 2nd CAD channel [ms]
    let toa_cad2 = TOA_SYMBOL_125["SF"+cad_sf2] * cad_symbols2;

    // Time on Air (TOA) of a Wake on Radio (WOR) frame sent on the default CAD channel [ms] 
    let toa_wor = TOA_WOR_125["SF"+cad_sf];

    // Time on Air (TOA) of a Wake on Radio (WOR) frame sent on the 2nd CAD channel [ms]
    let toa_wor2 = TOA_WOR_125["SF"+cad_sf2];

    // Time on Air (TOA) of an ACK frame sent on the default CAD channel [ms] 
    let toa_ack = TOA_ACK_125["SF"+cad_sf];

    // Time on Air (TOA) of an ACK frame sent on the 2nd CAD channel [ms]
    let toa_ack2 = TOA_ACK_125["SF"+cad_sf2];

    // Time of an Uplink RX slot of the Relay for receiving frames from an End-device [ms]
    let toa_uplink_rx = TOA_DATA_125["SF"+ed_ul_sf+"DL"+ed_ul_size];

    // Time of a Uplink TX sent by the Relay to a Gateway [ms]
    let toa_uplink_tx = TOA_DATA_125["SF"+relay_to_gw_sf+"DL"+ed_ul_size];

    // Total number of Uplink messages sent by all End-devices 
    let ul_per_day = ed_count * ed_ul_day;

    // Total number of Downlink messages sent to all End-devices 
    let dl_per_day = ed_count * ed_dl_day;
    
    // Time of the Downlink RX slot of the Relay for receiving frames from a Gateway [ms]
    let toa_downlink_rx = TOA_DATA_125["SF"+gw_to_relay_sf+"DL"+ed_dl_size];
        
    // Time of a Downlink TX sent by the Relay to an End-device [ms]
    let toa_downlink_tx = TOA_DATA_125["SF"+ed_dl_sf+"DL"+ed_dl_size];
    
    // Average synchronization time [ms]
    let avg_sync_time = ed_ul_period * PPM_DRIFT / 1_000_000;






    // Consumed charge per Day for CHANNEL ACTIVITY DETECTION [uA*ms/Day]
    let cad = cad_per_day * (
        RADIO_RX_CURRENT * (toa_cad+toa_cad2*is_2nd_ch_active) 
        + TCXO_CURRENT * TCXO_STARTUP_TIME
        + (1+is_2nd_ch_active) * UC_ACTIVE_CURRENT * UC_WAKEUP_TIME 
    ); // [uA*ms/Day]

    // Consumed charge per Day for SYNCHRONIZATION [uA*ms/Day]
    let sync = ul_per_day * (
        RADIO_RX_CURRENT * min(avg_sync_time,cad_period)
        + UC_ACTIVE_CURRENT * UC_WAKEUP_TIME
    ); // [uA*ms/Day]
    
    // Consumed charge per Day for WAKE ON RADIO [uA*ms/Day]
    let wor =(ul_per_day+cad_per_day*false_wor_detect_percent/100)*(toa_wor+toa_wor2)/2*RADIO_RX_CURRENT;
    wor += ul_per_day*UC_WAKEUP_TIME*UC_ACTIVE_CURRENT;                              // [uA*ms/Day]
    
    // Consumed charge per Day for WAKE ON RADIO ACKNOWLEDGMENTS [uA*ms/Day]
    let ack = ul_per_day * (
        RADIO_TX_CURRENT * (toa_ack+toa_ack2)/2
        + UC_ACTIVE_CURRENT * UC_WAKEUP_TIME
    ); // [uA*ms/Day]
    
    // Consumed charge per Day for receiving Uplink frames [uA*ms/Day]
    let rx_ul = ul_per_day * (
        RADIO_RX_CURRENT * toa_uplink_rx
        + UC_ACTIVE_CURRENT * UC_WAKEUP_TIME
    ); // [uA*ms/Day]
    
    // Consumed charge per Day for transmitting Uplink frames [uA*ms/Day]
    let tx_ul = ul_per_day * (
        RADIO_TX_CURRENT * toa_uplink_tx
        + UC_ACTIVE_CURRENT * UC_WAKEUP_TIME
    ); // [uA*ms/Day]
    
    // Consumed charge per Day for receiving Downlink frames [uA*ms/Day]
    let rx_dl = dl_per_day * (
        RADIO_RX_CURRENT * toa_downlink_rx
        + UC_ACTIVE_CURRENT * UC_WAKEUP_TIME
    ); // [uA*ms/Day]
    
    // Consumed charge per Day for transmitting Downink frames [uA*ms/Day]
    let tx_dl = dl_per_day * (
        RADIO_TX_CURRENT * toa_downlink_tx
        + UC_ACTIVE_CURRENT * UC_WAKEUP_TIME
    ); // [uA*ms/Day]
    
    // Consumed charge per Day while sleeping [uA*ms/Day]
    let sleep = 
        RADIO_SLEEP_CURRENT * (
            24*60*60*1000
            - cad_per_day * toa_cad
            - ul_per_day  * (toa_wor + toa_ack + toa_uplink_rx + toa_uplink_tx)
            - dl_per_day  * (toa_downlink_rx + toa_downlink_tx)
        )
        + UC_SLEEP_CURRENT * (
            24*60*60*1000
            - (cad_per_day + 3*ul_per_day + dl_per_day) * UC_WAKEUP_TIME
        ); // [uA*ms/Day]

    // Consumed charge per Day by Battery Leakage [uA*ms/Day]
    let battery_leak = ed_battery_count * BATTERY[relay_battery_type].nominal_capacity   // [Ah/Month]
                       * BATTERY_LEAK_PERCENT_PER_MONTH * (1/2)                          // [Ah/Month]
                       * 1_000_000 * 3_600_000 / 30                                      // [uA*ms/Day]
                       + BATTERY_LEAK_CURRENT * 24 * 3_600_000;                          // [uA*ms/Day]

    // Total consumed charge [uA*ms/Day]
    let sum = cad + sync + wor + ack + rx_ul + tx_ul + rx_dl + tx_dl + sleep + battery_leak;

    // The total consumed charge from the battery in [uAh/day]
    let battery_consumption_per_day = sum / (3_600_000);

    // The total usable battery capacity [Ah]
    let battery_capacity = relay_battery_count * BATTERY[relay_battery_type].nominal_capacity  // [Ah]
                           * BATTERY_PRACTICAL_CAPACITY_PARCENT * 1_000_000;                   // [uAh]

    // the estimated battery life on [Years]
    let battery_life = battery_capacity / (battery_consumption_per_day * 365);                 // [Years]


    // ***********************************
    // * CALCULATE END-DEVICE RESULTS
    // ***********************************

    // The time of a Wake on Radio frame [ms]
    let ed_wor_duration = TOA_WOR_125["SF"+cad_sf];

    // The time of a Wake on Radio Acknoledgment frame [ms]
    let ed_ack_duration = TOA_ACK_125["SF"+cad_sf];

    // The Time on Air of an Uplink frame sent by a relayed End-device [ms]
    let ed_ul_toa = TOA_DATA_125["SF"+ed_ul_sf+"DL"+ed_ul_size];

    // The Time on Air of a Downlink frame received by a relayed End-device [ms]
    let ed_dl_toa = TOA_DATA_125["SF"+ed_dl_sf+"DL"+ed_dl_size];

    // The RX1 timeout on a relayed End-device [ms]
    let ed_rx1_timeout = max(6, TOA_SYMBOL_125["SF"+ed_dl_sf]*6);

    // The RX2 timeout on a relayed End-device [ms]
    let ed_rx2_timeout = max(6, TOA_SYMBOL_125["SF12"]*6);

    // The RX3 timeout on a relayed End-device [ms]
    let ed_rx3_timeout = max(6, TOA_SYMBOL_125["SF"+cad_sf]*6);




    // Consumed charge per Day for SYNCHRONIZATION [uA*ms/Day]
    let ed_sync = min(avg_sync_time, cad_period) * RADIO_TX_CURRENT * ed_ul_day;

    // Consumed charge per Day for WAKE ON RADIO [uA*ms/Day]
    let ed_wor = ed_wor_duration * RADIO_TX_CURRENT * ed_ul_day;

    // Consumed charge per Day for WAKE ON RADIO ACKNOWLEDGMENTS [uA*ms/Day]
    let ed_ack = ed_ack_duration * RADIO_RX_CURRENT * ed_ul_day;

    // Consumed charge per Day for transmitting an Uplink frame [uA*ms/Day]
    let ed_tx_ul = ed_ul_toa     * RADIO_TX_CURRENT * ed_ul_day;

    // Consumed charge per Day for opening the RX1 receive window [uA*ms/Day]
    let ed_rx1 = ed_rx1_timeout  * RADIO_RX_CURRENT * ed_ul_day;
    
    // Consumed charge per Day for opening the RX2 receive window [uA*ms/Day]
    let ed_rx2 = ed_rx2_timeout  * RADIO_RX_CURRENT * ed_ul_day;
    
    // Consumed charge per Day for opening the RX3 receive window [uA*ms/Day]
    let ed_rx3 = ed_rx3_timeout  * RADIO_RX_CURRENT * (ed_ul_day - ed_dl_day);
    
    // Consumed charge per Day for receiving a Downlink frame [uA*ms/Day]
    let ed_rx_dl = ed_dl_toa     * RADIO_RX_CURRENT * ed_dl_day;

    // Consumed charge per Day by Battery Leakage [uA*ms/Day]
    let ed_battery_leak = ed_battery_count * BATTERY[ed_battery_type].nominal_capacity   // [Ah/Month]
                          * BATTERY_LEAK_PERCENT_PER_MONTH * (1/2)                       // [Ah/Month]
                          * 1_000_000 * 3_600_000 / 30                                   // [uA*ms/Day]
                          + BATTERY_LEAK_CURRENT * 24 * 3_600_000;                       // [uA*ms/Day]

    // Total consumed charge [uA*ms/Day]
    let ed_sum = ed_sync + ed_wor + ed_ack + ed_tx_ul + ed_rx1 + ed_rx2 + ed_rx3 + ed_rx_dl + ed_battery_leak;

    // The total consumed charge from the battery in [uAh/day]
    let ed_battery_consumption_per_day = ed_sum / (3_600_000);

    // The total usable battery capacity [Ah]
    let ed_battery_capacity = ed_battery_count * BATTERY[ed_battery_type].nominal_capacity        // Ah
                              * BATTERY_PRACTICAL_CAPACITY_PARCENT * 1_000_000;                   // uAh

    // the estimated battery life on [Years]
    let ed_battery_life = ed_battery_capacity / (ed_battery_consumption_per_day * 365);    // years
    



    // ***********************************
    // * SHOW RESULTS ON PAGE
    // ***********************************

    showResults({
        cad, sync, wor, ack, rx_ul, tx_ul, rx_dl, tx_dl, sleep, battery_leak,
        battery_consumption_per_day, battery_life,
        ed_sync, ed_wor, ed_ack, ed_tx_ul, ed_rx1, ed_rx2, ed_rx3, ed_rx_dl, ed_battery_leak, 
        ed_battery_consumption_per_day, ed_battery_life,
    });

}