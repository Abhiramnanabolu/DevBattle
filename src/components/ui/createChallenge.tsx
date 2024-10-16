import React, { useState } from "react";
import { PlusIcon, XIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface TestCase {
  input: string; 
  expectedOutput: string; 
}

interface Question {
  id: number;
  title: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  testCases: TestCase[]; 
}

export default function CreateChallenge() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [duration, setDuration] = useState<number>(0); 
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      title: "",
      problemStatement: "",
      inputFormat: "",
      outputFormat: "",
      constraints: "",
      testCases: [], 
    },
  ]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);
  const router = useRouter();

  const handleAddQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      title: "",
      problemStatement: "",
      inputFormat: "",
      outputFormat: "",
      constraints: "",
      testCases: [], 
    };
    setQuestions([...questions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  };

  const handleDeleteQuestion = (id: number) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
    if (expandedQuestion === id) {
      setExpandedQuestion(updatedQuestions[0]?.id || null);
    }
  };

  const handleChangeQuestion = (
    index: number,
    field: keyof Question,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setQuestions(updatedQuestions);
  };

  const handleAddTestCase = (questionId: number) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          testCases: [...q.testCases, { input: "", expectedOutput: "" }],
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleChangeTestCase = (
    questionId: number,
    index: number,
    field: keyof TestCase,
    value: string
  ) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        const updatedTestCases = [...q.testCases];
        updatedTestCases[index] = {
          ...updatedTestCases[index],
          [field]: value,
        };
        return { ...q, testCases: updatedTestCases };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const challengeData = {
      title,
      description,
      duration, 
      questions,
    };
    console.log("Challenge Data: ", challengeData);

    try {
      const response = await fetch("/api/createChallenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challengeData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
      router.push(`/challenge/manage/${result.challenge.id}/`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gray-900 text-white p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Create a Challenge</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          <div className="space-y-6">
            <div className="group">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-gray-900">
                Challenge Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Eg . String Manipulation Challenge"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition duration-300 ease-in-out"
              />
            </div>
            <div className="group">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-gray-900">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Eg . Complete the following string manipulation tasks."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition duration-300 ease-in-out"
              />
            </div>
            <div className="group">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-gray-900">
                Duration (minutes)
              </label>
              <input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition duration-300 ease-in-out"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-gray-50 rounded-lg shadow-sm overflow-hidden transition-all duration-300 ease-in-out"
              >
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleExpand(question.id)}
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    Question {index + 1}: {question.title || "Untitled"}
                  </h3>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuestion(question.id);
                      }}
                      className="mr-2 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
                      aria-label="Delete question"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                    {expandedQuestion === question.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
                {expandedQuestion === question.id && (
                  <div className="p-4 space-y-4 bg-white">
                    <div className="group">
                      <label htmlFor={`question-${index}-title`} className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-gray-900">
                        Title
                      </label>
                      <input
                        id={`question-${index}-title`}
                        type="text"
                        value={question.title}
                        onChange={(e) => handleChangeQuestion(index, "title", e.target.value)}
                        placeholder="Eg  . Reverse a String"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition duration-300 ease-in-out"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor={`question-${index}-problem-statement`} className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-gray-900">
                        Problem Statement
                      </label>
                      <textarea
                        id={`question-${index}-problem-statement`}
                        value={question.problemStatement}
                        onChange={(e) => handleChangeQuestion(index, "problemStatement", e.target.value)}
                        placeholder="Eg  . Given a string, reverse the string."
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition duration-300 ease-in-out"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor={`question-${index}-input-format`} className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-gray-900">
                        Input Format
                      </label>
                      <textarea
                        id={`question-${index}-input-format`}
                        value={question.inputFormat}
                        onChange={(e) => handleChangeQuestion(index, "inputFormat", e.target.value)}
                        placeholder="Eg . A Single String"
                        required
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition duration-300 ease-in-out"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor={`question-${index}-output-format`} className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-gray-900">
                        Output Format
                      </label>
                      <textarea
                        id={`question-${index}-output-format`}
                        value={question.outputFormat}
                        onChange={(e) => handleChangeQuestion(index, "outputFormat", e.target.value)}
                        placeholder="Eg . Reversed String"
                        required
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition duration-300 ease-in-out"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor={`question-${index}-constraints`} className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-gray-900">
                        Constraints
                      </label>
                      <textarea
                        id={`question-${index}-constraints`}
                        value={question.constraints}
                        onChange={(e) => handleChangeQuestion(index, "constraints", e.target.value)}
                        placeholder="Eg . The string will have a maximum length of 100 characters."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition duration-300 ease-in-out"
                      />
                    </div>

                    <h4 className="text-lg font-medium text-gray-900">Test Cases</h4>
                    {question.testCases.map((testCase, testCaseIndex) => (
                      <div key={testCaseIndex} className="border border-gray-300 rounded p-2">
                        <div className="group mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Input
                          </label>
                          <input
                            type="text"
                            value={testCase.input}
                            onChange={(e) => handleChangeTestCase(question.id, testCaseIndex, 'input', e.target.value)}
                            required
                            placeholder="Eg . hello"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition duration-300 ease-in-out"
                          />
                        </div>
                        <div className="group mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Expected Output
                          </label>
                          <input
                            type="text"
                            value={testCase.expectedOutput}
                            placeholder="Eg . olleh
                            
                            "
                            onChange={(e) => handleChangeTestCase(question.id, testCaseIndex, 'expectedOutput', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition duration-300 ease-in-out"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddTestCase(question.id)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Test Case
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Question
            </button>
          </div>

          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out transform hover:scale-105"
          >
            Create Challenge
          </button>
        </form>
      </div>
    </div>
  );
}
