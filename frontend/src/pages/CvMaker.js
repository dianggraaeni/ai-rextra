import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  GraduationCap,
  Users,
  FileText,
  Eye,
  Download,
  Check,
  Upload,
  Edit,
} from "lucide-react";

// Mock Navbar component since it's imported but not defined
const Navbar = () => (
  <nav className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">Rextra CV</h1>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

function CvMaker() {
  const [selectedMode, setSelectedMode] = useState(null); // "upload" or "manual"
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      phoneNumber: "",
      email: "",
      linkedinUrl: "",
      portfolioUrl: "",
      address: "",
      shortDescription: "",
    },
  });

  const steps = [
    { number: 1, title: "Personal Information", icon: User, color: "blue" },
    { number: 2, title: "Professional", icon: Briefcase, color: "blue" },
    { number: 3, title: "Education", icon: GraduationCap, color: "purple" },
    { number: 4, title: "Organisational", icon: Users, color: "pink" },
    { number: 5, title: "Others", icon: FileText, color: "orange" },
    { number: 6, title: "Review", icon: Eye, color: "green" },
  ];

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);
      // Simulate AI processing
      setTimeout(() => {
        setIsProcessing(false);
        // In real implementation, this would populate formData with extracted info
        setFormData({
          personalInfo: {
            fullName: "John Doe", // Extracted from CV
            phoneNumber: "+1234567890",
            email: "john.doe@example.com",
            linkedinUrl: "",
            portfolioUrl: "",
            address: "",
            shortDescription: "Experienced software developer with 5+ years...",
          },
        });
      }, 3000);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderPersonalInformation = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex items-center">
          <div className="bg-yellow-400 rounded-full p-1 mr-2">
            <span className="text-white text-xs font-bold px-2">TIPS</span>
          </div>
          <p className="text-sm text-yellow-800">
            Help recruiters to get in touch with you.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={formData.personalInfo.fullName}
            onChange={(e) =>
              handleInputChange("personalInfo", "fullName", e.target.value)
            }
            placeholder="Joshua Phua"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (Mobile)
            </label>
            <input
              type="tel"
              value={formData.personalInfo.phoneNumber}
              onChange={(e) =>
                handleInputChange("personalInfo", "phoneNumber", e.target.value)
              }
              placeholder="+6591234567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.personalInfo.email}
              onChange={(e) =>
                handleInputChange("personalInfo", "email", e.target.value)
              }
              placeholder="joshua@kinobi.asia"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile URL
          </label>
          <input
            type="url"
            value={formData.personalInfo.linkedinUrl}
            onChange={(e) =>
              handleInputChange("personalInfo", "linkedinUrl", e.target.value)
            }
            placeholder="linkedin.com/joshuaphua"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Portfolio/Website URL (Optional)
          </label>
          <input
            type="url"
            value={formData.personalInfo.portfolioUrl}
            onChange={(e) =>
              handleInputChange("personalInfo", "portfolioUrl", e.target.value)
            }
            placeholder="Enter portfolio/website URL, e.g. https://github.com/josh"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address (Optional)
          </label>
          <input
            type="text"
            value={formData.personalInfo.address}
            onChange={(e) =>
              handleInputChange("personalInfo", "address", e.target.value)
            }
            placeholder="Enter address, e.g. 53 Ang Mo Kio Avenue 3, Singapore"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short description about yourself
          </label>
          <textarea
            value={formData.personalInfo.shortDescription}
            onChange={(e) =>
              handleInputChange(
                "personalInfo",
                "shortDescription",
                e.target.value
              )
            }
            placeholder="One shot, give it your all. Lorem"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended: 100 to 150 characters
          </p>
        </div>
      </div>
    </div>
  );

  const renderModeSelection = () => (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Create Your Professional CV
            </h1>
            <p className="text-xl text-gray-300">
              Choose how you'd like to build your CV
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload CV Mode */}
            <div
              onClick={() => handleModeSelect("upload")}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Upload Existing CV
                </h3>
                <p className="text-gray-600 mb-6">
                  Upload your current CV and let AI extract and enhance your
                  information automatically. Perfect for quick updates and
                  improvements.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>AI-powered data extraction</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Automatic formatting</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Smart content suggestions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Fill Mode */}
            <div
              onClick={() => handleModeSelect("manual")}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Edit className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Fill Manually
                </h3>
                <p className="text-gray-600 mb-6">
                  Build your CV from scratch with our guided step-by-step
                  process. Complete control over every detail.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Step-by-step guidance</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Customizable templates</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Real-time preview</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderUploadMode = () => (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Upload Your CV
                </h1>
                <p className="text-xl text-gray-600">
                  Upload your existing CV and let AI extract your information
                </p>
              </div>

              {!uploadedFile ? (
                <div className="bg-gray-50 rounded-lg p-8">
                  <div className="text-center">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Upload Your CV
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Upload your existing CV (PDF, DOC, or DOCX) and let AI
                      extract your information
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="cv-upload"
                      />
                      <label
                        htmlFor="cv-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <span className="text-lg font-medium text-gray-900 mb-2">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-sm text-gray-500">
                          PDF, DOC, DOCX up to 10MB
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Upload Success */}
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          CV Uploaded Successfully
                        </h3>
                        <p className="text-gray-600">{uploadedFile.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Processing */}
                  {isProcessing ? (
                    <div className="bg-blue-50 rounded-lg p-8">
                      <div className="text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          AI is Processing Your CV
                        </h3>
                        <p className="text-gray-600">
                          Extracting information and optimizing content...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Extracted Information
                        </h2>
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                          Edit Manually
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={formData.personalInfo.fullName}
                              onChange={(e) =>
                                handleInputChange(
                                  "personalInfo",
                                  "fullName",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={formData.personalInfo.email}
                              onChange={(e) =>
                                handleInputChange(
                                  "personalInfo",
                                  "email",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={formData.personalInfo.phoneNumber}
                            onChange={(e) =>
                              handleInputChange(
                                "personalInfo",
                                "phoneNumber",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Professional Summary
                          </label>
                          <textarea
                            value={formData.personalInfo.shortDescription}
                            onChange={(e) =>
                              handleInputChange(
                                "personalInfo",
                                "shortDescription",
                                e.target.value
                              )
                            }
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end space-x-4">
                        <button
                          onClick={() => setSelectedMode(null)}
                          className="px-6 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Back
                        </button>
                        <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center">
                          <Download className="w-5 h-5 mr-2" />
                          Download Enhanced CV
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInformation();
      case 2:
        return (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Professional Experience
            </h3>
            <p className="text-gray-500">
              Add your work experience and professional background.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Education
            </h3>
            <p className="text-gray-500">
              Include your educational background and qualifications.
            </p>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Organisational Experience
            </h3>
            <p className="text-gray-500">
              Add leadership roles, volunteer work, and organizational
              involvement.
            </p>
          </div>
        );
      case 5:
        return (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Other Information
            </h3>
            <p className="text-gray-500">
              Include skills, certifications, awards, and additional
              information.
            </p>
          </div>
        );
      case 6:
        return (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Review Your CV
            </h3>
            <p className="text-gray-500">
              Review all sections and download your professional CV.
            </p>
            <div className="mt-8">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto">
                <Download className="w-5 h-5 mr-2" />
                Download CV
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Main render logic
  if (!selectedMode) {
    return renderModeSelection();
  }

  if (selectedMode === "upload") {
    return renderUploadMode();
  }

  // Manual mode - existing stepper interface
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  AI Rextra CV Builder
                </h1>
                <p className="text-xl text-gray-600">
                  Build your professional CV step by step
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar - Stepper */}
                <div className="lg:w-1/3">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4">
                      {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.number;
                        const isCompleted = currentStep > step.number;

                        return (
                          <div
                            key={step.number}
                            className="flex items-center space-x-4"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isActive
                                  ? "bg-blue-600 text-white"
                                  : isCompleted
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <span className="text-sm font-medium">
                                  {step.number}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`font-medium ${
                                  isActive
                                    ? "text-blue-600"
                                    : isCompleted
                                    ? "text-green-600"
                                    : "text-gray-700"
                                }`}
                              >
                                {step.title}
                              </p>
                            </div>
                            <Icon
                              className={`w-5 h-5 ${
                                isActive
                                  ? "text-blue-600"
                                  : isCompleted
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:w-2/3">
                  <div className="bg-gray-50 rounded-lg">
                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-200 rounded-t-lg">
                      <div
                        className="h-full bg-blue-600 rounded-t-lg transition-all duration-300"
                        style={{ width: `${(currentStep / 6) * 100}%` }}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {steps[currentStep - 1].title}
                        </h2>
                      </div>

                      {renderStepContent()}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center px-8 py-6 bg-gray-100 rounded-b-lg">
                      <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      <div className="text-sm text-gray-500">
                        Step {currentStep} of {steps.length}
                      </div>

                      <button
                        onClick={nextStep}
                        disabled={currentStep === 6}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CvMaker;
