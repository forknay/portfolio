from flask import request, jsonify
from config import app, db
from sqlalchemy.exc import IntegrityError
import models


@app.route("/students", methods=['GET'])
def get_students():
    students = models.Student.query.all()
    return {
        'students': [student.to_dict() for student in students]
    }, 200

@app.route("/students/<int:student_id>", methods=['GET'])
def get_student(student_id):
    student = models.Student.query.get(student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404
    return jsonify(student.to_dict()), 200

@app.route("/create_student", methods=['POST'])
def create_student():
    data = request.get_json()
    if not data or data.get('fname') is None or data.get('lname') is None or data.get('email') is None:
        return jsonify({"error": "Not enough data provided"}), 400
    try:
        new_student = models.Student(
            fname=data.get('fname'),
            lname=data.get('lname'),
            email=data.get('email'),
            phone=data.get('phone')
        )
        db.session.add(new_student)
        db.session.commit()
        return jsonify({"message": "Student created successfully"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already exists"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/update_student/<int:student_id>", methods=['PUT'])
def update_student(student_id):
    student = models.Student.query.get(student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    try:
        student.fname = data.get('fname', student.fname)
        student.lname = data.get('lname', student.lname)
        student.email = data.get('email', student.email)
        student.phone = data.get('phone', student.phone)

        db.session.commit()
        return jsonify({"message": "Student updated successfully"}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already exists"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)