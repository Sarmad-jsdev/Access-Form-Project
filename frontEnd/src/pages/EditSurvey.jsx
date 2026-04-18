import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2, PlusCircle, ArrowLeft } from "lucide-react";

const EditSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const headingRef = useRef(null);

  const [survey, setSurvey] = useState(null);
  const [errors, setErrors] = useState({});

  // ================= FETCH SURVEY =================
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axiosInstance.get(`/creator/survey/${id}`);

        const fixedSurvey = {
          ...res.data,
          questions: (res.data.questions || []).map((q) => ({
            ...q,
            _id: q._id || crypto.randomUUID(),
            options: q.options || [],
          })),
        };

        setSurvey(fixedSurvey);
      } catch (err) {
        toast.error("Failed to load survey");
      }
    };

    fetchSurvey();
  }, [id]);

  // focus heading
  useEffect(() => {
    if (survey && headingRef.current) {
      headingRef.current.focus();
    }
  }, [survey]);

  // ================= VALIDATION =================
  const validate = () => {
    const err = {};

    if (!survey.title?.trim()) err.title = "Title required";
    if (!survey.description?.trim()) err.description = "Description required";

    if (!survey.questions.length) {
      err.questions = "At least 1 question required";
    }

    survey.questions.forEach((q, i) => {
      if (!q.questionText?.trim()) {
        err[`q_${i}`] = "Question required";
      }

      if (
        ["radio", "checkbox", "dropdown"].includes(q.questionType) &&
        q.options.length < 2
      ) {
        err[`opt_${i}`] = "At least 2 options required";
      }
    });

    return err;
  };

  // ================= UPDATE FIELDS =================
  const updateSurveyField = (field, value) => {
    setSurvey((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateQuestion = (id, field, value) => {
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q._id === id ? { ...q, [field]: value } : q
      ),
    }));
  };

  const updateOption = (qId, index, value) => {
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q._id !== qId) return q;

        const updated = [...q.options];
        updated[index] = value;

        return { ...q, options: updated };
      }),
    }));
  };

  // ================= ADD QUESTION =================
  const addQuestion = () => {
    setSurvey((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          _id: crypto.randomUUID(),
          questionText: "",
          questionType: "text",
          options: [],
        },
      ],
    }));
  };

  // ================= DELETE QUESTION =================
  const deleteQuestion = (id) => {
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q._id !== id),
    }));
  };

  // ================= SAVE =================
  const handleUpdate = async () => {
    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      toast.error("Fix errors first");
      return;
    }

    try {
      await axiosInstance.put(`/creator/edit-survey/${id}`, survey);
      toast.success("Survey updated");
      navigate("/creator-dashboard");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!survey) {
    return (
      <div className="p-8 bg-[var(--bg-secondary)] text-[var(--text-primary)]">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-[var(--bg-secondary)] font-[var(--font-dyslexia)]">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/creator-dashboard")}
        className="mb-6 px-4 py-2 rounded-lg 
        bg-[var(--bg-primary)] 
        text-[var(--text-primary)] 
        border border-[var(--border)]"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <section className="max-w-3xl mx-auto bg-[var(--bg-primary)] p-6 rounded-xl shadow">

        {/* TITLE */}
        <h1
          ref={headingRef}
          tabIndex="-1"
          className="text-3xl font-bold mb-4 text-[var(--text-primary)]"
        >
          Edit Survey
        </h1>

        <input
          value={survey.title}
          onChange={(e) => updateSurveyField("title", e.target.value)}
          className="w-full p-3 mb-2 
          bg-[var(--bg-secondary)] 
          text-[var(--text-primary)] 
          border border-[var(--border)] rounded"
          placeholder="Title"
        />
        {errors.title && <p className="text-red-500">{errors.title}</p>}

        {/* DESCRIPTION */}
        <textarea
          value={survey.description}
          onChange={(e) =>
            updateSurveyField("description", e.target.value)
          }
          className="w-full p-3 mb-4 
          bg-[var(--bg-secondary)] 
          text-[var(--text-primary)] 
          border border-[var(--border)] rounded"
          placeholder="Description"
        />

        {/* QUESTIONS */}
        {survey.questions.map((q) => (
          <div
            key={q._id}
            className="mb-6 p-4 border border-[var(--border)] rounded"
          >

            <input
              value={q.questionText}
              onChange={(e) =>
                updateQuestion(q._id, "questionText", e.target.value)
              }
              className="w-full p-2 mb-2 
              bg-[var(--bg-secondary)] 
              text-[var(--text-primary)] 
              border border-[var(--border)] rounded"
              placeholder="Question"
            />

            <select
              value={q.questionType}
              onChange={(e) =>
                updateQuestion(q._id, "questionType", e.target.value)
              }
              className="w-full p-2 
              bg-[var(--bg-secondary)] 
              text-[var(--text-primary)] 
              border border-[var(--border)] rounded"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
              <option value="dropdown">Dropdown</option>
            </select>

            {/* OPTIONS */}
            {q.questionType !== "text" &&
              q.questionType !== "number" &&
              q.options.map((opt, i) => (
                <input
                  key={`${q._id}-${i}`}
                  value={opt}
                  onChange={(e) =>
                    updateOption(q._id, i, e.target.value)
                  }
                  className="w-full mt-2 p-2 
                  bg-[var(--bg-secondary)] 
                  text-[var(--text-primary)] 
                  border border-[var(--border)] rounded"
                  placeholder="Option"
                />
              ))}

            {q.questionType !== "text" &&
              q.questionType !== "number" && (
                <button
                  onClick={() => updateQuestion(q._id, "options", [...q.options, ""])}
                  className="text-[var(--primary)] mt-2 text-sm"
                >
                  + Add Option
                </button>
              )}

            {/* DELETE */}
            <button
              onClick={() => deleteQuestion(q._id)}
              className="mt-3 text-red-500 flex items-center gap-1"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        ))}

        {/* ADD QUESTION */}
        <button
          onClick={addQuestion}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PlusCircle size={16} /> Add Question
        </button>

        {/* SAVE */}
        <button
          onClick={handleUpdate}
          className="ml-3 bg-[var(--primary-dark)] text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>
      </section>
    </main>
  );
};

export default EditSurvey;