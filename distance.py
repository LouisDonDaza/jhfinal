import math

print('First Point Axis (x1, y1) ')
print("="*25)
x1=float(input('Input the value of x1 '))
y1=float(input('Input the value of y1 '))
print('Second Point Axis (x1,y1) ')
print("="*25)
x2=float(input('Input the value of x2 '))
y2=float(input('Input the value of y2 '))
p1 = [x1, y1]
p2 = [x2, y2]
dist=math.sqrt(((p1[0]-p2[0])**2)+((p1[1]-p2[1])**2))
print('The distance between the points are: ', dist)