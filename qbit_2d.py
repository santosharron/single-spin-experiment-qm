import numpy as np

states = [+1, -1]
init_vec = [0, 0, 1] #pointing in +z direction

state_vec = init_vec

def angle_to_unit_vec(alpha, beta):
    x = np.cos(beta)*np.sin(alpha)
    y = np.cos(beta)*np.cos(alpha)
    z = np.sin(beta)

    return [x, y, z]

def measure(state_vec, measure_vec):
    expected_value = np.dot(state_vec, measure_vec)

    up_prob = (1 + expected_value)/2.0
    
    measurement = np.random.choice(states, size=1, p=[up_prob, 1-up_prob])
    
    return measurement, measure_vec


# Ref - https://math.stackexchange.com/questions/1385137/calculate-3d-vector-out-of-two-angles-and-vector-length
# Ref - https://stackoverflow.com/questions/30011741/3d-vector-defined-by-2-angles
# Spin measurement dot product - Lecture 2 https://www.youtube.com/watch?v=a6ANMKRBjA8&ab_channel=Stanford
# Spin in magnetic field - Lecture 5 https://www.youtube.com/watch?v=sgQafF7tLSo&ab_channel=Stanford

#Take input in angles, its easier than entering unit vectors
#Turn angles from degrees to radians
#Turn it from spherical co-ordinates to cartersian co-ordinates
#Expected value is the dot product of spin vector and new vector.
#Calculate probability of up and down accordingly. Need to think about this.
#Store new direction of spin, always in cartesian form.
while True:
    alpha_deg = input("Enter angle alpha measured from X-axis towards Y-axis (degrees): ")
    alpha_deg = float(alpha_deg)

    beta_deg = input("Enter angle beta measured from Y-axis towards Z-axis (degrees): ")
    beta_deg = float(beta_deg)

    alpha = np.radians(alpha_deg)
    beta = np.radians(beta_deg)

    measure_vec = angle_to_unit_vec(alpha, beta)

    measurement, new_state_vec = measure(state_vec, measure_vec)
    print("Measured: {}".format(measurement))
    state_vec = new_state_vec


