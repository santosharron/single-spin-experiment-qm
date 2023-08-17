function initialize() {
    update_state(state_vec, null);
    update_measurement(null, measure_vec);

    console.log("init measure vec " + init_measure_vec.arraySync());
    console.log(state_vec.arraySync(), measure_vec.arraySync());
    viz_init(state_vec.arraySync(), measure_vec.arraySync());
    //viz_init2(state_vec.arraySync(), measure_vec.arraySync());
}

if(document.readyState != "loading") {
    initialize();
}else {
    document.addEventListener("DOMContentLoaded", function(event) { 
        initialize();
    });
}