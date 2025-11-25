import Course from "../Models/courseModels.js";

/**
 * Get all courses
 */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: 1 }).lean();
    return res.json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Add a subject.
 * Body: { courseName: string, semester: number OR "Semester 1" style, subjectName, credits }
 *
 * If course doesn't exist, create it.
 * If semester doesn't exist, create it.
 * Push subject (with numeric id = Date.now()) into the semester.subjects.
 */
export const addSubject = async (req, res) => {
  try {
    let { courseName, semester, subjectName, credits } = req.body;

    if (!courseName || !semester || !subjectName || (credits === undefined || credits === null)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // allow "Semester 1" or numeric 1
    if (typeof semester === "string" && semester.toLowerCase().startsWith("semester")) {
      const parts = semester.split(" ");
      semester = parseInt(parts[1], 10);
    } else {
      semester = parseInt(semester, 10);
    }

    credits = parseInt(credits, 10);

    if (!Number.isInteger(semester) || !Number.isInteger(credits)) {
      return res.status(400).json({ message: "semester and credits must be numbers" });
    }

    const subjectId = Date.now();

    let course = await Course.findOne({ name: courseName });

    if (!course) {
      course = new Course({
        name: courseName,
        semesters: [
          {
            semester,
            subjects: [
              { id: subjectId, name: subjectName, credits }
            ]
          }
        ]
      });

      await course.save();
      const courses = await Course.find({}).lean();
      return res.status(201).json(courses);
    }

    // course exists
    const semIndex = course.semesters.findIndex(s => s.semester === semester);
    if (semIndex === -1) {
      course.semesters.push({
        semester,
        subjects: [{ id: subjectId, name: subjectName, credits }]
      });
      // keep semesters ordered
      course.semesters.sort((a, b) => a.semester - b.semester);
    } else {
      course.semesters[semIndex].subjects.push({ id: subjectId, name: subjectName, credits });
    }

    await course.save();
    const courses = await Course.find({}).lean();
    return res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update a subject
 * Params: courseId, semester (number)
 * Params subjectId (in path) or in body
 * Body: { name, credits }
 *
 * We match subject by subject.id (numeric). Frontend uses Date.now() so numeric IDs are supported.
 */
export const updateSubject = async (req, res) => {
  try {
    const { courseId, semester, subjectId } = req.params;
    const { name, credits } = req.body;

    if (!name && (credits === undefined || credits === null)) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const semNum = parseInt(semester, 10);
    const subjIdNum = parseInt(subjectId, 10);

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const sem = course.semesters.find(s => s.semester === semNum);
    if (!sem) return res.status(404).json({ message: "Semester not found" });

    const subj = sem.subjects.find(s => s.id === subjIdNum);
    if (!subj) return res.status(404).json({ message: "Subject not found" });

    if (name) subj.name = name;
    if (credits !== undefined) subj.credits = parseInt(credits, 10);

    await course.save();
    const courses = await Course.find({}).lean();
    return res.json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a course by courseId
 */
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    await Course.findByIdAndDelete(courseId);
    const courses = await Course.find({}).lean();
    return res.json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
