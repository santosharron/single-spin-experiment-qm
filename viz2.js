function xt(v, t) {
    return [v[0]*t, -v[1]*t, v[2]*t];
}

let p;
var show_circle = false;

function viz_init(svec, mvec, view3=false, mfvec=null) {
    
    var smult = 310;

    var s_disp_vec = xt(svec, smult);
    var m_disp_vec = xt(mvec, 300);
    
    var mf_disp_vec = s_disp_vec;
    if(view3) {
        mf_disp_vec = xt(mfvec, 300);
    }
    
    const GraphExample = function(s) {
        //let tnr;
        let time = {
            ar: frames(2),
            grid: frames(3)
        };
        let axes_object, g3;
        s.preload = function() {
        //    tnr = s.loadFont('../lib/font/times.ttf');    // loads font (Times new roman)
        axes_object = s.loadModel('./manim_js/Manim.js/lib/obj/axes.obj');
        };
        s.setup = function () {
            // this sets frameRate to be 30, and creates a canvas of 1200 by 675 (you can adjust these in globals.js)
            setup3D(s); 
            g3 = s.createGraphics(6400, 4800, s.WEBGL);
            //console.log(axes_object);

            s.a = new Axes3D(s, {
                angle: -2.2,
                speed: 0.005,
                camRadius: 700,
                model: axes_object,
                //bgColor: White
            });
            

            s.spin_vec = new Arrow3D(s, {
                from: [0,0,0],
                to: s_disp_vec,
                color: Blue
            });
            
            s.magnetic_field_vec = new Arrow3D(s, {
                from:[0,0,0],
                to: mf_disp_vec,
                color: Green
            });

            s.measure_vec = new Arrow3D(s, {
                from: [0,0,0],
                to: m_disp_vec,
                color: Red
            });

            s.point = new Point3D(s, {
                x: 3000.0,
                y: 0.0,
                z: 0.0,
                radius: 30,
                color: [75,125,178]
            });
            
            s.circle = new Circle3D(s, {
                x: 0.0, 
                y: 0.0,
                z: 0.0,
                radius: 100.0
            })
            /*new Arrow(s, {
                y1: 317, y2: 317, x1: 607, x2: 647, start: time.ar, strokeweight: 4,
                color: s.color(255, 0, 0)
            });*/
            s.grid = new Grid(s, {
                left: 0, centerX: 0, start: time.grid
            });
            s.spin_legend_marker = new Arrow(s, {
                y1: 40, y2: 10, x1: 460, x2: 460, strokeweight: 3,
                color: Blue
            });
            s.spin_legend_text = new Text(s, { 
                str: "Spin Direction", mode: 1, x: 550, y: 25, size: 25 
            });
            s.measure_legend_marker = new Arrow(s, {
                y1: 90, y2: 60, x1: 360, x2: 360, strokeweight: 3,
                color: Red
            });
            s.measure_legend_text = new Text(s, { 
                str: "Measurement Direction", mode: 1, x: 500, y: 75, size: 25 
            });
            s.mag_field_legend_marker = new Arrow(s, {
                y1: 90, y2: 60, x1: 360, x2: 360, strokeweight: 3,
                color: Green
            });
            s.mag_field_legend_text = new Text(s, { 
                str: "Magnetic field Direction", mode: 1, x: 500, y: 75, size: 25 
            });
            s.spin_avg_legend_marker = new Point(s, {
                x: 450, y: 125, radius:30,
                color: Blue
            });
            s.spin_avg_legend_text = new Text(s, { 
                str: "Spin (average)", mode: 1, x: 550, y: 125, size: 25 
            });
            //s.arrs = new Arrows_Transform(s, {
            //    time: time, start: time.three_to_two, showBasis: true, //showX: true,
            //});

            // creates an undirected graph
            /*s.g = new Graph_U(s, {  // parameters are passed in via an object
                V: G.V, 
                E: G.E, 
                //font: tnr,
                start: 40,   // the time to start the animation in frames
                color_e: [7, 97, 7],   // color of edges in RGB
                color_v: Yellow,   // set color of nodes, using the global Yellow variable
            });*/
        };
        s.draw = function () {
            s.background(0);
            s.a.show(g3);  // Manim.js classes usually define a show() function to be called in draw()
            //s.grid.showGrid();
            
            if(view3) {
                s.magnetic_field_vec.show(g3);
            }
            else {
                s.measure_vec.show(g3);
            }

            s.spin_vec.show(g3);
          
            if (show_circle) {
                s.circle.show(g3);
                s.point.show(g3);
            }
            
            s.spin_legend_marker.show();
            s.spin_legend_text.show();
            

            if(view3) {
               s.mag_field_legend_marker.show();
               s.mag_field_legend_text.show();
               s.spin_avg_legend_marker.show();
               s.spin_avg_legend_text.show(); 
            }
            else{
               s.measure_legend_marker.show();
               s.measure_legend_text.show();
            }
            s.image(g3, -100, 37, 640, 480);
        };
    };
    
    p = new p5(GraphExample);   // creates the p5 object to render the animation
}

function update_anim(svec, mvec) {
    //p.spin_vec.to = x300(svec);
    //console.log(svec, mvec);
    p.spin_vec.move({to: xt(svec, 310), duration: 0.05});

    //p.measure_vec.to = x300(mvec);
    p.measure_vec.move({to: xt(mvec, 300), duration:0.05});
}

function update_anim2(pvec) {
    //console.log("point should move to " + pvec);
    show_circle = true;
    p.point.move({to: xt([pvec[2], pvec[1], pvec[0]], 300), duration:0.05});

    //p.spin_vec.move({to: xt([-pvec[0], pvec[1], pvec[2]], 300), duration:0.05});

    var radius = 300.0*Math.sqrt(pvec[0]*pvec[0] + pvec[1]*pvec[1])
    p.circle.updateRadius(radius);
    var cvec = [0, 0, pvec[2]];
    p.circle.move({to: xt(cvec, 300), duration: 0.005});

    var pointRadius = Math.min(radius, 30);
    p.point.updateRadius(pointRadius);

}

/*
document.addEventListener("DOMContentLoaded", function(event) { 
    console.log(state_vec.arraySync(), measure_vec.arraySync());
    viz_init(state_vec.arraySync(), measure_vec.arraySync());
    //viz_init2(state_vec.arraySync(), measure_vec.arraySync());
  });
*/
