function deleteQuestionByID(userID) {
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa?');
    if (confirmDelete) {
        console.log('Xóa đi: /', userID);
        axios.post('/admin/delete-question', {
            question: userID
        })
            .then(function (response) {
                window.location.reload();
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function deleteCourseByID(userID) {
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa?');
    if (confirmDelete) {
        console.log('Xóa đi: /', userID);
        axios.post('/admin/delete-course', {
            course: userID
        })
            .then(function (response) {
                window.location.reload();
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function deleteStudentByID(studentID) {
    console.log('Đã ở đây')
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa?');
    if (confirmDelete) {
        axios.post('/admin/delete-student', {
            studentID: studentID
        })
            .then(function (response) {
                window.location.reload();
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
function deleteTeacherByID(teacherID) {
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa?');
    if (confirmDelete) {
        axios.post('/admin/delete-teacher', {
            teacherID: teacherID
        })
            .then(function (response) {
                window.location.reload();
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
function deleteExamByID(examID) {
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa?');
    if (confirmDelete) {
        axios.post('/admin/delete-exam', {
            examID: examID
        })
            .then(function (response) {
                window.location.reload();
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    let itervalTime = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        display.textContent = minutes + ":" + seconds;
        let time = $('#clock-time').text().split(':');
        localStorage.setItem('duration', `${time[0]}:${time[1]}`)
        if (--timer < 0) {
            clearInterval(itervalTime)
            $('#form-exam').submit();
            alert('Hết Thời Gian Làm Bài!');
        }
    }, 1000);
}
$(document).ready(async function () {
    const responseStudentAdmin = await axios.get('http://localhost:3000/admin/get-all-student');
    const responseStudentTeacher = await axios.get('http://localhost:3000/teacher/get-all-student');
    const responseTeacher = await axios.get('http://localhost:3000/admin/get-all-teacher');
    const responseQuestionAdmin = await axios.get('http://localhost:3000/admin/get-all-question');
    const responseQuestionTeacher = await axios.get('http://localhost:3000/teacher/get-all-question');
    const responseExam = await axios.get('http://localhost:3000/admin/get-all-exam');

    let students = responseStudentAdmin.data;
    let studentsTeacher = responseStudentTeacher.data;
    let teachers = responseTeacher.data;
    let questionsAdmin = responseQuestionAdmin.data;
    let questionsTeacher = responseQuestionTeacher.data;
    let exams = responseExam.data;



    $('#search-student').on('change', function (event) {
        let studentSearch = $('#search-student').val();
        let tableStudentContent = '';
        students
            .filter(student => student.name.includes(studentSearch) || student.studentID == studentSearch)
            .forEach((student, index) => {
                tableStudentContent += `
                <tr>
                <th scope="row">${index + 1}</th>
                <td>${student.studentID} </td>
                <td>${student.name} </td>
                <td>${student.subject.name} </td>
                <td style="width: 100px;">
                <div class="row justify-content-center">
                    <form action="/admin/edit-student" method="POST" class="d-inline-block">
                        <input type="text" name="studentID" value="${student.studentID}" hidden>
                            <button type="submit" class="text-warning bg-transparent border-0"
                                title="Edit Student">
                                <i class="far fa-edit"></i>
                            </button>
                    </form>
                <button onclick="deleteStudentByID('${student.studentID}')" type="submit" class="text-danger bg-transparent border-0" title="Delete Student"><i class="far fa-trash-alt"></i></button>
                </tr>`;
            })
        $('#table-content-student').html(tableStudentContent);
    })
    $('#search-teacher').on('change', function (event) {
        let teacherSearch = $('#search-teacher').val();
        let tableTeacherContent = '';
        teachers
            .filter(teacher => teacher.name.includes(teacherSearch) || teacher.teacherID === teacherSearch)
            .forEach((teacher, index) => {
                tableTeacherContent += `
                <tr>
                <th scope="row">${index + 1}</th>
                <td>${teacher.teacherID} </td>
                <td>${teacher.name} </td>
                <td>${teacher.subject.name} </td>
                <td style="width: 100px;">
                <div class="row justify-content-center">
                    <form action="/admin/edit-teacher" method="POST" class="d-inline-block">
                        <input type="text" name="teacherID" value="${teacher.teacherID}" hidden>
                            <button type="submit" class="text-warning bg-transparent border-0"
                                title="Edit Teacher">
                                <i class="far fa-edit"></i>
                            </button>
                    </form>
                <button onclick="deleteTeacherByID('${teacher.teacherID}')" type="submit" class="text-danger bg-transparent border-0" title="Delete Student"><i class="far fa-trash-alt"></i></button>
                </tr>`;
            })
        $('#table-content-teacher').html(tableTeacherContent);
    })
    $('#search-question').on('change', function (event) {
        let questionSearch = $('#search-question').val();
        let tableQuestionContent = '';
        let questions = questionsAdmin;
        questions
            .filter(question => question.question.includes(questionSearch))
            .forEach((question, index) => {
                let date = new Date(question.createdDate);
                let day = date.getDate() < 10 ? `0${date.getDate()} ` : date.getDate();
                let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1} ` : date.getMonth() + 1;
                let year = date.getFullYear();
                let hours = date.getHours() + 1 < 10 ? `0${date.getHours() + 1} ` : date.getHours() + 1;
                let minutes = date.getMinutes() + 1 < 10 ? `0${date.getMinutes() + 1} ` : date.getMinutes() + 1;
                let seconds = date.getSeconds() + 1 < 10 ? `0${date.getSeconds() + 1} ` : date.getSeconds() + 1;
                let dateStr = `${day} -${month} -${year} | ${hours}: ${minutes}: ${seconds} `;

                tableQuestionContent += `
                <tr>
                                <th scope="row">${ index + 1}  </th>
                                <td>${ question.question} </td>
                                <td>${ question.teacher.name}</td>
                                <td>${dateStr}</td>
                                <td style="width: 100px;>
                                    <div class="row justify-content-center">
                                        <form action="/admin/edit-question" class="d-inline-block" method="POST">
                                            <input type="text" name="question" value="<%=question._id %>" hidden>
                                            <button type="submit" class="text-warning bg-transparent border-0"
                                                title="Edit Question">
                                                <i class="far fa-edit"></i>
                                            </button>
                                        </form>
                                        <button onclick="deleteQuestionByID('${question._id}')" type=" button"
                                            class="text-danger bg-transparent border-0" title="Delete Question">
                                            <i class="far fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                `;
            })
        $('#table-content-question').html(tableQuestionContent);
    })
    $('#search-question-teacher').on('change', function (event) {
        let questionSearch = $('#search-question-teacher').val();
        let tableQuestionContent = '';
        let questions = questionsTeacher;

        questions
            .filter(question => question.question.includes(questionSearch))
            .forEach((question, index) => {
                let date = new Date(question.createdDate);
                let day = date.getDate() < 10 ? `0${date.getDate()} ` : date.getDate();
                let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1} ` : date.getMonth() + 1;
                let year = date.getFullYear();
                let hours = date.getHours() + 1 < 10 ? `0${date.getHours() + 1} ` : date.getHours() + 1;
                let minutes = date.getMinutes() + 1 < 10 ? `0${date.getMinutes() + 1} ` : date.getMinutes() + 1;
                let seconds = date.getSeconds() + 1 < 10 ? `0${date.getSeconds() + 1} ` : date.getSeconds() + 1;
                let dateStr = `${day} -${month} -${year} | ${hours}: ${minutes}: ${seconds} `;
                let level = '';
                if (question.level === 'easy') level = 'Dễ';
                if (question.level === 'normal') level = 'Trung Bình';
                if (question.level === 'hard') level = 'Khó';
                tableQuestionContent += `
                <tr>
                                <th scope="row">${ index + 1} </th>
                                <td style="width: 400px">${ question.question} </td>
                                <td class="text-center">${ question.chapter} </td>
                                <td class="text-center">${ level} </td>
                                <td>${ question.teacher.subject.name}</td>
                                <td>${dateStr}</td>
                                <td style="width: 100px;>
                                    <div class="row justify-content-center">
                                        <form action="/teacher/edit-question" class="d-inline-block"  method="POST">
                                            <input type="text" name="question" value="<%=question._id %>" hidden>
                                            <button type="submit" class="text-warning bg-transparent border-0"
                                                title="Edit Question">
                                                <i class="far fa-edit"></i>
                                            </button>
                                        </form>
                                        <button onclick="deleteQuestionByID('${question._id}')" type=" button"
                                            class="text-danger bg-transparent border-0" title="Delete Question">
                                            <i class="far fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                `;
            })
        $('#table-content-question-teacher').html(tableQuestionContent);
    })
    $('#search-student-teacher').on('change', function (event) {
        let studentSearch = $('#search-student-teacher').val();
        let tableStudentContent = '';
        studentsTeacher
            .filter(student => student.name.includes(studentSearch) || student.studentID === studentSearch)
            .forEach((student, index) => {
                let score = student.score || null;
                tableStudentContent += `
                <tr>
                <th scope="row">${index + 1}</th>
                <td>${student.studentID} </td>
                <td>${student.name} </td>
                <td>${student.subject.name} </td>
                <td>${score ? score : 'Đang Cập Nhật..'}.</td>
                </tr>`;
            })
        $('#table-content-student').html(tableStudentContent);
    })
    $('#search-exam').on('change', function (event) {
        let examSearch = $('#search-exam').val();

        let tableContentExam = '';
        exams
            .filter(exam => exam.name.includes(examSearch) || exam.examID.includes(examSearch))
            .forEach((exam, index) => {
                const date1 = new Date(exam.startDate);
                const day1 = date1.getDate() < 10 ? `0${date1.getDate()} ` : date1.getDate();
                const month1 = date1.getMonth() + 1 < 10 ? `0${date1.getMonth() + 1} ` : date1.getMonth() + 1;
                const year1 = date1.getFullYear();
                const dateStr1 = `${day1} -${month1} -${year1} `;
                tableContentExam += `
                <tr>
                <th scope="row">${index + 1} </th>
                <td>${exam.examID} </td>
                <td>${exam.name} </td>  
                <td>${exam.subject.name} </td>
                <td>${dateStr1} </td>
                <td>${exam.timeDuration} Phút </td>
                <td>${exam.status === 'inprogress' ? 'Đang Diễn Ra' : 'Hết Hạn'}</td>
                <td>
                    <a class="text-warning text-lg" title="Edit Quesion"><i class="far fa-edit"></i></a>
                    <a class="text-danger" title="Delete Quesion"><i class="far fa-trash-alt"></i></a>
                </td>
                </tr>    
                `;
            })
        $('#table-content-exam').html(tableContentExam);
    })
    window.addEventListener('blur', () => {
        // localStorage.clear();
        // console.log('Blur');
        $('#form-exam').submit();
    })
    $('input[type="radio"]').click(function () {
        if ($(this).is(':checked')) {
            let classes = $(this).data('qi');
            $(`#${classes}`).addClass('bg-success')
        }
    });
    if (localStorage.getItem('duration')) {
        let time = localStorage.getItem('duration');
        time = time.split(':');
        let minus = parseInt(time[0], 10);
        let seconds = parseInt(time[1], 10);
        return startTimer(minus * 60 + seconds, $('#clock-time')[0]);
    } else {
        let time = $('#clock-time').text().split(':')
        let clock = time[0];
        return startTimer(clock * 60, $('#clock-time')[0]);
    }
});
window.onload = window.localStorage.clear();
// $('#form-exam').on('submit', function (e) {
//     e.preventDefault();
//     setTimeout(() => {
//         window.location.replace('/student/confirm-exam');
//     }, 2000)
// });
$('#push-exam').on('click', function () {
    const c = confirm('Bạn có chắc chắn muốn nộp bài không?');
    if (c) $('#form-exam').submit();
});
// });
if (window.location.pathname === '/student/confirm-exam') {
    // window.location.replace('/student/confirm-exam');
}