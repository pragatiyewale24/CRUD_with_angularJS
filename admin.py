from flask import Flask, render_template, request,redirect,url_for,flash,session
from flask_login import login_required
from flask import make_response,jsonify
from flask_session.__init__ import Session
from flask_mysqldb import MySQL
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@localhost/student24'
db = SQLAlchemy(app)



class Admin(db.Model):
    admin_id = db.Column(db.Integer, primary_key=True)
    uname = db.Column(db.String(20), unique=False, nullable=False)
    password = db.Column(db.String(20), unique=False, nullable=False)


    def __repr__(self):
        return 'success'

class Student(db.Model):
    student_id = db.Column(db.Integer, primary_key=True)
    class_name=db.Column(db.String(20),nullable=False)
    is_monitor=db.Column(db.Integer,nullable=False)
    studying_subjects=db.Column(db.String(20),nullable=False)

    def __init__(self, class_name,is_monitor,studying_subjects):
      self.class_name=class_name
      self.is_monitor=is_monitor
      self.studying_subjects=studying_subjects

    

class Teacher(db.Model):
    teacher_id = db.Column(db.Integer, primary_key=True)
    department_name=db.Column(db.String(20),nullable=False)
    is_hod=db.Column(db.Integer,nullable=False)
    teaching_subject=db.Column(db.String(20),nullable=False)

    def __init__(self, department_name,is_hod,teaching_subject):
      self.department_name=department_name
      self.is_hod=is_hod
      self.teaching_subject=teaching_subject

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    fname=db.Column(db.String(20),nullable=False)
    lname=db.Column(db.String(20),nullable=False)
    email=db.Column(db.String(60),nullable=False)
    mobileno1=db.Column(db.String(20),nullable=False)
    about=db.Column(db.String(10),nullable=False)

    def __init__(self, fname,lname,email,mobileno1,about):
      self.fname=fname
      self.lname=lname
      self.email=email
      self.mobileno1=mobileno1
      self.about=about


@app.route('/')
def index():
    return render_template('login.html')  

@app.route('/adminlogin', methods=['GET', 'POST'])
def adminlogin():
    if request.method == "POST":
        try:
            data = request.get_json()
            uname=data.get('username')
            pass1=data.get('password1')
            registered_admin = Admin.query.filter_by(uname=uname,password=pass1).first()
            if registered_admin is not None:
                response_data={
                    'status_code':200,
                    'message':True,
                    }
                return jsonify(response_data)
            else:
                return jsonify({'result':'Incorrect Username or Password...' }) 
        except:
            response_data={
                    'status_code':501,
                    'result':'Something went wrong....'
                     }
            return jsonify(response_data)

@app.route('/adminlogout')
def adminlogout():
    return render_template('login.html')

      

@app.route('/userswitch')
def userswitch():
    return render_template('userswitch.html')


@app.route('/admininsert', methods=['POST'])
def admininsert():
    try:
        if request.method == "POST":
            data = request.get_json()
            uname=data.get('username')
            pass1=data.get('password1')
            entry_admin=Admin(uname=uname,password=pass1)
            db.session.add(entry_admin)
            db.session.commit()
            response_data={
                    'status_code':200,
                    'result':"You have successfully registered..."
                }
            return jsonify(response_data)

    except:     
        response_data={
                    'status_code':501,
                    'result':'Something went wrong....'
                     }
        return jsonify(response_data)


@app.route('/getstudent/<string:id_data>', methods = ['GET'])
def getstudent(id_data):
    student_obj=Student.query.filter_by(student_id=id_data).first()
    response_data={
                    'id':student_obj.student_id,
                    'class_name':student_obj.class_name,
                    'studying_subjects':student_obj.studying_subjects,
                    'is_monitor':student_obj.is_monitor
                    }
    return jsonify(response_data)

@app.route('/studentinfo')
def studentinfo():
    return render_template('studentdata.html', student = Student.query.all() )

@app.route('/studentinsert', methods=['POST'])
def studentinsert():
    try:
        if request.method == "POST":
            data = request.get_json()
            class_name=data.get('class_name')
            studying_subjects=data.get('studying_subjects')
            if data.get('is_monitor')=="1":
                is_monitor=1
            else:
                is_monitor=0
            entry_student=Student(class_name=class_name,studying_subjects=studying_subjects,is_monitor=is_monitor)
            db.session.add(entry_student)
            db.session.commit()
            response_data={
                    'status_code':200,
                    'result':"Student Data added successfully ..."
                }
            return jsonify(response_data)

    except:     
        response_data={
        'status_code':501,
        'result':"Something Went wrong..."
        }
        return jsonify(response_data)

@app.route('/studentdelete/<string:id_data>', methods = ['GET'])
def studentdelete(id_data):
    try:
        delete_student=Student.query.filter_by(student_id=id_data).first()
        db.session.delete(delete_student)
        db.session.commit()
        return redirect(url_for('studentinfo'))
    except:     
        response_data={
        'status_code':501,
        'result':"Something Went wrong..."
        }
        return jsonify(response_data)


@app.route('/studentupdate',methods=['POST','GET'])
def studentupdate():
    try:
        if request.method == 'POST':
            data = request.get_json()
            id_data=data.get('id')
            class_name=data.get('class_name')
            studying_subjects=data.get('studying_subjects')
            is_monitor=0
            if data.get('is_monitor')=="1":
                is_monitor=1
            else:
                is_monitor=0
            update_student=Student.query.filter_by(student_id=id_data).first()
            update_student.class_name=class_name
            update_student.is_monitor=is_monitor
            update_student.studying_subjects=studying_subjects
            db.session.commit()
            response_data={
                    'status_code':200,
                    'result':"Student Data updated successfully ..."
                }
            return jsonify(response_data)

    except:
        return jsonify({'result':'Something went wrong....' })



'''**********Teacher Module***********'''
@app.route('/getteacher/<string:id_data>', methods = ['GET'])
def getteacher(id_data):
    teacher_obj=Teacher.query.filter_by(teacher_id=id_data).first()
    response_data={
                    'id':teacher_obj.teacher_id,
                    'department_name':teacher_obj.department_name,
                    'teaching_subject':teacher_obj.teaching_subject,
                    'is_hod':teacher_obj.is_hod
                    }
    
    return jsonify(response_data)

@app.route('/teacherinfo')
def teacherinfo():
    return render_template('teacherdata.html', teacher = Teacher.query.all() )

@app.route('/teacherinsert', methods=['POST'])
def teacherinsert():
    try:
        if request.method == "POST":
            data = request.get_json()
            department_name=data.get('department_name')
            teaching_subject=data.get('teaching_subject')
            if data.get('is_hod')=="0":
                is_hod=0
            else:
                is_hod=1
            entry_teacher=Teacher(department_name=department_name,is_hod=is_hod,teaching_subject=teaching_subject)
            db.session.add(entry_teacher)
            db.session.commit()
            response_data={
                    'status_code':200,
                    'result':"Teacher Data added successfully ..."
                }
            return jsonify(response_data)

    except:     
        response_data={
        'status_code':501,
        'result':'Something went wrong....'
        }
        return jsonify(response_data)

@app.route('/teacherdelete/<string:id_data>', methods = ['GET'])
def teacherdelete(id_data):
    delete_teacher=Teacher.query.filter_by(teacher_id=id_data).first()
    db.session.delete(delete_teacher)
    db.session.commit()
    return redirect(url_for('teacherinfo'))


@app.route('/teacherupdate',methods=['POST','GET'])
def teacherupdate():
    try:
        if request.method == 'POST':
            data = request.get_json()
            id_data=data.get('id')
            department_name=data.get('department_name')
            if data.get('is_hod')=="0":
                is_hod=0
            else:
                is_hod=1
            teaching_subject=data.get('teaching_subject')
            update_teacher=Teacher.query.filter_by(teacher_id=id_data).first()
            update_teacher.department_name=department_name
            update_teacher.is_hod=is_hod
            update_teacher.teaching_subject=teaching_subject
            db.session.commit()
            response_data={
                    'status_code':200,
                    'result':"Teacher Data updated successfully ..."
                }
            return jsonify(response_data)
    except:
        return jsonify({'result':'Something went wrong!' })
'''*************User Module*********'''
@app.route('/user',methods=['POST'])
def user():
    if request.method=='POST':
        response_data = {
                "result": 'Switched to User',
                "sucess": True,
                "status_code": 200,             
                }  
        return jsonify(response_data)

@app.route('/getuser/<string:id_data>', methods = ['GET'])
def getuser(id_data):
    user_obj=User.query.filter_by(user_id=id_data).first()
    response_data={
                    'id':user_obj.user_id,
                    'fname':user_obj.fname,
                    'lname':user_obj.lname,
                    'email':user_obj.email,
                    'phone':user_obj.mobileno1,
                    'about':user_obj.about
                     }
    
    return jsonify(response_data)
    
@app.route('/userinfo')
def userinfo():
        return render_template('userdata.html', user= User.query.all() )

@app.route('/userinsert', methods=['POST'])
def userinsert():
    try:
        if request.method == "POST":
            data = request.get_json()
            fname=data.get('first_name')
            lname=data.get('last_name')
            email=data.get('email')
            mobileno1=data.get('phone')
            about=data.get('about')
            registered_user = User.query.filter_by(mobileno1=mobileno1).first()
            if registered_user is not None:
                return jsonify({'result':'Mobile number already exist.'}) 
            else:
                entry_user=User(fname=fname,lname=lname,email=email,mobileno1=mobileno1,about=about)
                db.session.add(entry_user)
                db.session.commit()
                response_data={
                    'status_code':200,
                    'result':"User Data added successfully ..."
                }
                return jsonify(response_data)
                
    except:
            response_data={
                'status_code':501,
                'result':"Something Went wrong..."
            }
            return jsonify(response_data)
            
@app.route('/userdelete/<string:id_data>', methods = ['GET'])
def userdelete(id_data):
    delete_user=User.query.filter_by(user_id=id_data).first()
    db.session.delete(delete_user)
    db.session.commit()
    return redirect(url_for('userinfo'))


@app.route('/userupdate',methods=['POST','GET'])
def userupdate():
    try:
        if request.method == 'POST':
            data = request.get_json()
            id_data=data.get('id')
            fname=data.get('first_name')
            lname=data.get('last_name')
            email=data.get('email')
            mobileno1=data.get('phone')
            about=data.get('about')
            update_user=User.query.filter_by(user_id=id_data).first()
            update_user.fname=fname
            update_user.lname=lname
            update_user.email=email
            update_user.mobileno1=mobileno1
            update_user.about=about
            db.session.commit()
            response_data={
                'status_code':200,
                'result':"User data Updated successfully ..."
            }
            return jsonify(response_data)
            

    except:
        response_data={
        'status_code':501,
        'result':"Something Went wrong..."
        }
        return jsonify(response_data)
        

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)

