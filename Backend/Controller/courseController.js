import Course from "../Models/courseModels.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: 1 }).lean();
    return res.json(courses);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const addSubject = async (req, res) => {
  try {
    let { courseName, semester, subjectName, credits } = req.body;

    if (!courseName || !semester || !subjectName)
      return res.status(400).json({ message: "Missing required fields" });

    semester = parseInt(semester);
    credits = parseInt(credits);

    const subjectId = Date.now();

    let course = await Course.findOne({ name: courseName });

    // create new course
    if (!course) {
      course = new Course({
        name: courseName,
        semesters: [
          {
            semester,
            subjects: [{ id: subjectId, name: subjectName, credits }],
          },
        ],
      });
      await course.save();
      return res.status(201).json(await Course.find({}).lean());
    }

    // existing course
    const semIndex = course.semesters.findIndex((s) => s.semester === semester);

    if (semIndex === -1) {
      course.semesters.push({
        semester,
        subjects: [{ id: subjectId, name: subjectName, credits }],
      });
    } else {
      course.semesters[semIndex].subjects.push({
        id: subjectId,
        name: subjectName,
        credits,
      });
    }

    await course.save();
    return res.json(await Course.find({}).lean());
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { courseId, semester, subjectId } = req.params;
    const { name, credits } = req.body;

    const semNum = parseInt(semester);
    const subId = parseInt(subjectId);

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const sem = course.semesters.find((s) => s.semester === semNum);
    if (!sem) return res.status(404).json({ message: "Semester not found" });

    const subj = sem.subjects.find((s) => s.id === subId);
    if (!subj) return res.status(404).json({ message: "Subject not found" });

    subj.name = name;
    subj.credits = parseInt(credits);

    await course.save();
    return res.json(await Course.find({}).lean());
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.courseId);
    return res.json(await Course.find({}).lean());
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
