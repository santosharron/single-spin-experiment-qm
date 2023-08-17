var default_spin_vec = tf.tensor1d([-0.5, 0.5, 0.7071068286895752]); //angle_to_unit_vec(pi/4.0, pi/4.0);
state_vec = default_spin_vec;
var magnetic_field_vec = init_vec;

function initialize() {
    update_state(state_vec, null);
    update_measurement(null, measure_vec);

    console.log(state_vec.arraySync(), magnetic_field_vec.arraySync());
    viz_init(state_vec.arraySync(), measure_vec.arraySync(), view3=true, mfvec=magnetic_field_vec.arraySync());
}

if(document.readyState != "loading") {
    initialize();
}else {
    document.addEventListener("DOMContentLoaded", function(event) { 
        initialize();
    });
}

function set_spin_direction_v3(){
    var spin_vec = get_measure_vec();
    
    update_state(spin_vec, null);
    align_measurement();
}

function reset_direction_v3() {
    document.getElementById("alpha_text").value = 45;
    document.getElementById("beta_text").value = 45;

    update_state(default_spin_vec, null);
    align_measurement();  
}