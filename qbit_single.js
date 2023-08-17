
var states = ["+1", "-1"];
var state_values = [1, -1];
var init_vec = tf.tensor1d([0.0, 0.0, 1.0]); //pointing in +z direction
var state_vec = init_vec;

var init_measure_vec = tf.tensor1d([-1.0, 0.0, 0.0]); //pointing in +x direction, -1 because stange p5 coords
var measure_vec = init_measure_vec;
var run_hamilton_exp = false;
var pi = Math.PI;

//storing angles for use later on
let alpha;
let beta;

/*
document.addEventListener("DOMContentLoaded", function(event) { 
  update_state(state_vec, null);
  update_measurement(null, measure_vec);
});
*/

function update_measurement(measurement_idx, measure_vec) {
  if(measure_vec != null) { 
    document.getElementById("measure_vec").innerHTML = "[" + measure_vec.arraySync() + "]";
  } else {
    document.getElementById("measure_vec").innerHTML = "";
  }
  
  if(measurement_idx != null) {
    document.getElementById("measurement").innerHTML = states[measurement_idx];
  } else {
    document.getElementById("measurement").innerHTML = "";
  }
}

function update_state(svec, measurement_idx) {
  state_vec = svec;
  
  document.getElementById("state").innerHTML = "[" + state_vec.arraySync() + "]";
  //update_state_viz(state_vec.arraySync());

  if(measurement_idx == null) {
    document.getElementById("along").style.display = "none";
    document.getElementById("opposite").style.display = "none";
    document.getElementById("waiting").style.display = "inline";
  }
  else {
    var measurement = state_values[measurement_idx];
    document.getElementById("waiting").style.display = "none";
    if (measurement == 1) {
      document.getElementById("along").style.display = "inline";
      document.getElementById("opposite").style.display = "none";
    } else {
      document.getElementById("along").style.display = "none";
      document.getElementById("opposite").style.display = "inline";
    }
 }
}

function reset_state() {
  state_vec = init_vec;
  update_state(state_vec, null);

  align_measurement();
  //measure_vec = init_measure_vec;
  //update_measurement(null, init_measure_vec);

  //update_anim(state_vec.arraySync(), measure_vec.arraySync());
}

function reset_direction() {
  document.getElementById("alpha_text").value = 0;
  document.getElementById("beta_text").value = 0;

  reset_state();
}

function align_measurement(){
  measure_vec = get_measure_vec();
  update_measurement(null, measure_vec);

  update_anim(state_vec.arraySync(), measure_vec.arraySync());
}

//Ref - https://www.w3resource.com/javascript-exercises/javascript-math-exercise-33.php
function degrees_to_radians(degrees)
{
  return degrees * (pi/180.0);
}

function angle_to_unit_vec(alpha, beta) {

  //because strange p5 coordinate system
  alpha = alpha - degrees_to_radians(90);

  var x = tf.mul(tf.cos(beta), tf.sin(alpha));
  var x2 = x.dataSync()[0];
  var y = tf.mul(tf.cos(beta), tf.cos(alpha));
  var y2 = y.dataSync()[0];
  var z = tf.sin(beta);
  var z2 = z.dataSync()[0];
  //console.log(x2[0]);
  var t =  tf.tensor1d([x2, y2, z2]);
  //t.print();
  
  return t
}

function measure(state_vec, measure_vec) {
  //console.log("state = " + state_vec + " measure = " + measure_vec);
	var expected_value = tf.dot(state_vec, measure_vec).dataSync()[0];
  
  //console.log("expected_value = " + expected_value);
  var up_prob = Math.min((1 + expected_value)/2.0, 1.0);
  //console.log("up_prob = " + up_prob);
  var measurement_idx = tf.multinomial([up_prob, 1 - up_prob], 1, seed=null, normalized=true);
  //console.log("probs = [" + up_prob + ", " + (1 - up_prob) + "]");
  //console.log("TF sampled " + measurement);
  return measurement_idx.dataSync()[0];
}

function get_measure_vec() {
	var alpha_deg = Number(document.getElementById("alpha_text").value);
  var beta_deg = Number(document.getElementById("beta_text").value);
  

  alpha = degrees_to_radians(alpha_deg);
  beta = degrees_to_radians(beta_deg);
  
  var measure_vec = angle_to_unit_vec(alpha, beta);
  
  return measure_vec;
}

function calculate_result() {
  var measure_vec = get_measure_vec();
  var measurement_idx = measure(state_vec, measure_vec);
  
  var measurement = state_values[measurement_idx];
  state_vec = measure_vec.mul(measurement);
  
  update_measurement(measurement_idx, measure_vec);
  update_state(state_vec, measurement_idx);
  update_anim(state_vec.arraySync(), measure_vec.arraySync());
  //document.getElementById("result").innerHTML = " measurement = " + measurement + " <br/>state = [" + state_vec.arraySync() + "]";
}

function start_experiment() {
  
  //update_measurement(null, null);
  //update_state(state_vec, null);

	var measure_vec = get_measure_vec();
  var start_vec = state_vec;
  //align_measurement();

  var n_times = parseInt(document.getElementById("n_times_text").value);
  
  measure_counts = {};
  for(const state of states){
  	measure_counts[state] = 0;
  }
  
  generate_vis(measure_counts, measure_vec, start_vec, n_times);
  
}

function run_experiment(measure_counts, measure_vec, start_vec, n_times, res, n_tot) {
	//console.log("Running Experiment " + n_times + " times");

  if (n_times > 0) {
    var measurement_idx = measure(start_vec, measure_vec);
    var measurement_state = states[measurement_idx];
    measure_counts[measurement_state] += 1;
    setTimeout(function() { update_vis(measure_counts, measure_vec, start_vec, n_times, res, measurement_idx, n_tot)}, 100);
    document.getElementById("sim_value").innerHTML = (n_tot - n_times + 1) + "/" + n_tot;
    
  }
  else {
    update_state(start_vec, null);
    update_measurement(null, measure_vec);
  }
  var count_arr = [];
  var total_times = 0;
  for (const st of states) {
    count_arr.push(measure_counts[st]);
    total_times += measure_counts[st];
  }

  for(var i = 0; i < count_arr.length; i++) {
    count_arr[i] /= total_times;
  }
  
  //console.log(state_values);
  //console.log(count_arr);
  document.getElementById("theory_value").innerHTML = tf.dot(start_vec, measure_vec).dataSync()[0].toFixed(4);
  document.getElementById("exp_value").innerHTML = tf.dot(tf.tensor(state_values), tf.tensor(count_arr)).dataSync()[0].toFixed(4);
  //document.getElementById("expected_value").innerHTML = "Theoretical Expected Value = " +  + " Experiment average = " + 
  

}

function update_vis(measure_counts, measure_vec, start_vec, n_times, res, measurement_idx, total_times) {
	//console.log("Updating vis " + JSON.stringify(measure_counts));
  
  var measurement_state_int = state_values[measurement_idx];
  var display_state_vec = tf.mul(measure_vec, measurement_state_int);
  update_state(display_state_vec, measurement_idx);
  update_measurement(measurement_idx, measure_vec);
  update_anim(display_state_vec.arraySync(), measure_vec.arraySync());
  
	var values = [];
  for(const [state, count] of Object.entries(measure_counts)) {
  	values.push({state: state, count: count});
  }
  
	var change_set = vega
  .changeset()
  .remove(function() { return true;})
  .insert(values);
  
  res.view.change('hist', change_set).run()
  
  run_experiment(measure_counts, measure_vec, start_vec, n_times - 1, res, total_times);
}

function generate_vis(measure_counts, measure_vec, start_vec, n_times) {
  var values = [];
  for(const [state, count] of Object.entries(measure_counts)) {
  	values.push({state: state, count: count});
  }
  
	var vis_spec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 200,
        height: 200,
        description: 'Bar chart of measurement counts',
        data: {
          name: 'hist',
          values: values
        },
        mark: 'bar',
        encoding: {
          x: {
            field: 'state', 
            type: 'ordinal',
            axis: {labelFontSize: 20, titleFontSize: 25}
          },
          y: {
            field: 'count', 
            type: 'quantitative', 
            scale: {domain: [0, n_times]},
            axis: {labelFontSize: 20, titleFontSize: 25}
          }
        }
      };
      vegaEmbed('#hist_vis', vis_spec).then(function (res) {
      	run_experiment(measure_counts, measure_vec, start_vec, n_times, res, n_times);
      });
}

function run_hamilton() {

  var mag_vec = tf.tensor1d([0.0, 0.0, 1.0]);
  var meas_vec = get_measure_vec();

  var z_dir = tf.tensor1d([0.0, 0.0, 1.0]);
  var y_dir = tf.tensor1d([0.0, 1.0, 0.0]);
  var x_dir = tf.tensor1d([1.0, 0.0, 0.0]);
  
  //the fluctuation happens around this value where either the x or y component is zero
  //use this as theoretical prediction (cheeky, I know)
  //using y component because we measure angles x-y and y-z, x component will require x-z angle
  var yz_spin_vec = angle_to_unit_vec(pi/2.0, beta);
  var r_th = tf.dot(yz_spin_vec, y_dir).dataSync()[0];
  console.log("r_th: " + r_th);

  console.log(tf.dot(meas_vec, x_dir).dataSync()[0]);
  console.log(x_dir.mul(tf.dot(meas_vec, x_dir).dataSync()[0]).arraySync());
  var sigma_x = r_th; //tf.dot(meas_vec, x_dir).dataSync()[0];
  var sigma_y = 0; //tf.dot(meas_vec, y_dir).dataSync()[0];
  var sigma_z = tf.dot(meas_vec, z_dir).dataSync()[0];
  
  console.log(sigma_x, sigma_y, sigma_z);

  console.log("th dot " + tf.dot(mag_vec, meas_vec).dataSync()[0]);

  var sigma_x_0 = sigma_x;
  var sigma_y_0 = sigma_y;
  var sigma_z_0 = sigma_z;
  
  console.log("Start value: " + sigma_x_0 + ", " + sigma_y_0 + ", " + sigma_z_0);

  var dt = Number(document.getElementById("dt_text").value);

  if (dt == null) {
    dt = 0.05; //0.0001;
  }

  run_hamilton_exp = true;
  document.getElementById("run_evolution_button").disabled = true;

  generate_hamilton_vis(sigma_x_0, sigma_y_0, sigma_x_0, sigma_y_0, sigma_z_0, r_th, dt, 0.0, meas_vec, [], []);
}

function generate_hamilton_vis(sigma_x, sigma_y, sigma_x_0, sigma_y_0, sigma_z_0, r_th, dt, t, meas_vec, values, avg_values) {
  update_state(meas_vec, null);
  align_measurement();

  if (values.length > 300) {
    values.shift();
    values.shift();
  }
  
  values.push(
    {"time": t, "sigma_x,sigma_y": sigma_x, "type": "x"},
    {"time": t, "sigma_x,sigma_y": sigma_y, "type": "y"},
  );
  
  var t_start = 0;
  var t_end = t + 1;
  if (values.length > 250) {
    t_start = t - 5;
  }

  var g1_spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 200,
    height: 200,
    description: 'Evolution of sigma_x and sigma_y',
    "params": [
      {"name": "max", "expr": "data('data_0')[0]['max']"},
      {"name": "length", "expr": "data('data_0')[0]['length']"}
    ],
    layer:[
      {
        data: {
          name: 'sx_sy',
          values: values
        },
        "transform": [
          {"joinaggregate": [
            {"op": "max", "field": "time", "as": "max"},
            {"op": "count", "field": "time", "as": "length"}
            ]}
        ],
        mark: {
          type: 'line',
          clip: true,
          tooltip: true
         },
         encoding: {
           x: {
             field: 'time', 
             type: 'quantitative',
             scale: {
              domainMax: {
                expr: "max+1"
              },
              domainMin: {
                "expr": "if(max > 5,max-5,0)"
              }
            },
             axis: {labelFontSize: 20, titleFontSize: 25, title: "time (seconds)"}
           },
           y: {
             field: 'sigma_x,sigma_y', 
             type: 'quantitative', 
             scale: {domain: [-1, 1]},
             axis: {labelFontSize: 20, titleFontSize: 25, title: "x and y components", }
           },
           color: {
             field: 'type',
             type: 'nominal',
             legend: {labelFontSize: 20, title:""}
           }
         }
      },
      {
        data: {
          name: 'sx_sy_point',
          values: values.slice(-2),
        },
        mark: {
          type: 'point',
          filled: true,
          size: 100,
          clip: true
         },
         encoding: {
           x: {
             field: 'time', 
             type: 'quantitative',
             //scale: {domain: [t_start, t_end]},
             axis: {labelFontSize: 20, titleFontSize: 25}
           },
           y: {
             field: 'sigma_x,sigma_y', 
             type: 'quantitative', 
             scale: {domain: [-1, 1]},
             axis: {labelFontSize: 20, titleFontSize: 25}
           },
           color: {
             field: 'type',
             type: 'nominal',
             legend: {labelFontSize: 20, title:""}
           }
         }
      }
    ]
    
  };
  

  if (avg_values.length > 300) {
    avg_values.shift();
    avg_values.shift();
  }
  
  var r_exp = Math.sqrt(sigma_x*sigma_x + sigma_y*sigma_y);
  //var r_th = Math.sqrt(sigma_x_0*sigma_x_0 + sigma_y_0*sigma_y_0);

  avg_values.push(
    {"time": t, "average": r_exp, "type": "experimental"},
    {"time": t, "average": r_th, "type": "theoretical"},
  );
  
  var y2_th = r_th;
  var y2_high = y2_th + dt;
  var y2_low = y2_th - dt;

  var g2_spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 200,
    height: 200,
    description: 'Evolution of average',
    "params": [
      {"name": "max", "expr": "data('data_0')[0]['max']"},
      {"name": "length", "expr": "data('data_0')[0]['length']"}
    ],
    layer:[
      {
        data: {
          name: 'avg',
          values: avg_values
        },
        "transform": [
          {"joinaggregate": [
            {"op": "max", "field": "time", "as": "max"},
            {"op": "count", "field": "time", "as": "length"}
            ]}
        ],
        mark: {
          type: 'line',
          clip: true,
          tooltip: true
         },
         encoding: {
           x: {
             field: 'time', 
             type: 'quantitative',
             scale: {
                domainMax: {
                  expr: "max+1"
                },
                domainMin: {
                  "expr": "if(max > 5,max-5,0)"
                }
              },
             axis: {labelFontSize: 20, titleFontSize: 25, title: "time (seconds)"}
           },
           y: {
             field: 'average', 
             type: 'quantitative', 
             scale: {domain: [y2_low, y2_high]},
             axis: {labelFontSize: 20, titleFontSize: 25, title: "radius", }
           },
           color: {
             field: 'type',
             type: 'nominal',
             legend: {labelFontSize: 20, title:""}
           }
         }
      },
      {
        data: {
          name: 'avg_point',
          values: avg_values.slice(-2),
        },
        mark: {
          type: 'point',
          filled: true,
          size: 100,
          clip: true
         },
         encoding: {
           x: {
             field: 'time', 
             type: 'quantitative',
             //scale: {domain: [t_start, t_end]},
             axis: {labelFontSize: 20, titleFontSize: 25}
           },
           y: {
             field: 'average', 
             type: 'quantitative', 
             scale: {domain: [y2_low, y2_high]},
             axis: {labelFontSize: 20, titleFontSize: 25}
           },
           color: {
             field: 'type',
             type: 'nominal',
             legend: {labelFontSize: 20, title:""}
           }
         }
      }
    ]
    
  };

  vegaEmbed('#g1_vis',g1_spec).then(function (g1_res) {
    vegaEmbed('#g2_vis', g2_spec).then(function(g2_res) {
      update_sigmas(sigma_x, sigma_y, sigma_x_0, sigma_y_0, sigma_z_0, r_th, dt, t, meas_vec, values, avg_values, g1_res, g2_res);
    });
  });
  
}

function update_hamilton_vis(sigma_x, sigma_y, sigma_x_0, sigma_y_0, sigma_z_0, r_th, dt, t, meas_vec, values, avg_values, g1_res, g2_res) {
  
  if (values.length > 300*0.05/dt) {
    values.shift();
    values.shift();
  }
  
  values.push(
    {"time": t, "sigma_x,sigma_y": sigma_x, "type": "x"},
    {"time": t, "sigma_x,sigma_y": sigma_y, "type": "y"},
  );
  

	var g1_change_set = vega
  .changeset()
  .remove(function() { return true;})
  .insert(values);
  
  var g1_change_set_point = vega.changeset().remove(
    function() {return true;}
  ).insert(values.slice(-2));

  g1_res.view.change('sx_sy', g1_change_set).run();
  g1_res.view.change('sx_sy_point', g1_change_set_point).run();

  if (avg_values.length > 300*0.05/dt) {
    avg_values.shift();
    avg_values.shift();
  }
  
  var r_exp = Math.sqrt(sigma_x*sigma_x + sigma_y*sigma_y);
  //var r_th = Math.sqrt(sigma_x_0*sigma_x_0 + sigma_y_0*sigma_y_0);

  avg_values.push(
    {"time": t, "average": r_exp, "type": "experimental"},
    {"time": t, "average": r_th, "type": "theoretical"},
  );
  
  var g2_change_set = vega
  .changeset()
  .remove(function() { return true;})
  .insert(avg_values);
  
  var g2_change_set_point = vega.changeset().remove(
    function() {return true;}
  ).insert(avg_values.slice(-2));

  g2_res.view.change('avg', g2_change_set).run();
  g2_res.view.change('avg_point', g2_change_set_point).run();
  
  update_sigmas(sigma_x, sigma_y, sigma_x_0, sigma_y_0, sigma_z_0, r_th, dt, t, meas_vec, values, avg_values, g1_res, g2_res);
}

function update_sigmas(sigma_x, sigma_y, sigma_x_0, sigma_y_0, sigma_z_0, r_th, dt, t, meas_vec, values, avg_values, g1_res, g2_res) {
  var r_exp = Math.sqrt(sigma_x*sigma_x + sigma_y*sigma_y);
  //var r_th = Math.sqrt(sigma_x_0*sigma_x_0 + sigma_y_0*sigma_y_0);
  var r_unit = Math.sqrt(sigma_x*sigma_x + sigma_y*sigma_y + sigma_z_0*sigma_z_0);

  if (run_hamilton_exp) {
    document.getElementById("sigma_x_exp_value").innerHTML = sigma_x.toFixed(4);
    document.getElementById("sigma_y_exp_value").innerHTML = sigma_y.toFixed(4);
    document.getElementById("sigma_x2_plus_y2_exp_value").innerHTML = (r_exp).toFixed(4);
    document.getElementById("sigma_x2_plus_y2_th_value").innerHTML = (r_th).toFixed(4);
    document.getElementById("unit_r").innerHTML = (r_unit).toFixed(4);

      var sigma_x_new = sigma_x, sigma_y_new = sigma_y; 
      sigma_x_new -= sigma_y_new*dt;
      sigma_y_new += sigma_x_new*dt;

      //update_anim([sigma_x_new, sigma_y_new, sigma_z_0], meas_vec.arraySync());
      update_anim2([sigma_x_new, sigma_y_new, sigma_z_0]);

      var new_t = t + dt;
      setTimeout(function() { update_hamilton_vis(sigma_x_new, sigma_y_new, sigma_x_0, sigma_y_0, sigma_z_0, r_th, dt, new_t, meas_vec, values, avg_values, g1_res, g2_res)}, 50);
  }
}

function stop_hamilton() {
  run_hamilton_exp = false;
  document.getElementById("run_evolution_button").disabled = false;
}