import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { diagnosisInputSchema, type DiagnosisInput, type DiagnosisResponse } from "@shared/schema";
import { 
  Stethoscope, 
  ClipboardList, 
  Brain, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Home, 
  Lightbulb,
  TriangleAlert,
  BriefcaseMedical,
  UserRound,
  Heart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const commonSymptoms = [
  "Nausea",
  "Fatigue", 
  "Shortness of breath",
  "Dizziness",
  "Sweating",
  "Anxiety",
  "Back pain",
  "Arm pain",
  "Jaw pain",
  "Indigestion"
];

export default function DiagnosisPage() {
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResponse | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const { toast } = useToast();

  const form = useForm<DiagnosisInput>({
    resolver: zodResolver(diagnosisInputSchema),
    defaultValues: {
      primarySymptom: "",
      associatedSymptoms: [],
      age: undefined,
      gender: undefined,
    },
  });

  const diagnosisMutation = useMutation({
    mutationFn: async (data: DiagnosisInput) => {
      const response = await apiRequest("POST", "/api/diagnosis", {
        ...data,
        associatedSymptoms: selectedSymptoms
      });
      return response.json();
    },
    onSuccess: (data: DiagnosisResponse) => {
      setDiagnosisResults(data);
      toast({
        title: "Analysis Complete",
        description: "Differential diagnosis has been generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate diagnosis",
        variant: "destructive",
      });
    },
  });

  const handleSymptomToggle = (symptom: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms(prev => [...prev, symptom]);
    } else {
      setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
    }
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomSymptom();
    }
  };

  const onSubmit = (data: DiagnosisInput) => {
    diagnosisMutation.mutate(data);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent": return "bg-alert-red text-white";
      case "moderate": return "bg-amber-500 text-white";
      case "mild": return "bg-healthcare-green text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "urgent": return <TriangleAlert className="w-4 h-4" />;
      case "moderate": return <Clock className="w-4 h-4" />;
      case "mild": return <Home className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const renderStars = (probability: number) => {
    const stars = Math.round(probability / 20); // Convert to 1-5 scale
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`text-sm ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-clinical-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Stethoscope className="text-medical-blue h-8 w-8 mr-3" />
                <h1 className="text-xl font-semibold text-dark-slate">MedAI Diagnosis</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">AI-Powered Medical Analysis</div>
              <div className="w-8 h-8 bg-healthcare-green rounded-full flex items-center justify-center">
                <UserRound className="text-white h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ClipboardList className="text-medical-blue h-5 w-5 mr-3" />
                  Symptom Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Primary Symptom */}
                    <FormField
                      control={form.control}
                      name="primarySymptom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-dark-slate">
                            Primary Symptom <span className="text-alert-red">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                {...field}
                                placeholder="e.g., chest pain, headache, fever"
                                className="pr-10"
                                data-testid="input-primary-symptom"
                              />
                              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <p className="text-xs text-gray-500">Describe the main symptom you're experiencing</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Associated Symptoms */}
                    <div>
                      <Label className="text-sm font-medium text-dark-slate mb-3 block">Associated Symptoms</Label>
                      
                      {/* Common Symptoms Grid */}
                      <div className="grid grid-cols-1 gap-2 mb-4">
                        {commonSymptoms.map((symptom) => (
                          <label 
                            key={symptom}
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={selectedSymptoms.includes(symptom)}
                              onCheckedChange={(checked) => handleSymptomToggle(symptom, checked as boolean)}
                              className="text-medical-blue"
                              data-testid={`checkbox-${symptom.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                            <span className="ml-3 text-sm text-dark-slate">{symptom}</span>
                          </label>
                        ))}
                      </div>

                      {/* Custom Symptom Input */}
                      <div className="relative">
                        <Input
                          value={customSymptom}
                          onChange={(e) => setCustomSymptom(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Add other symptoms..."
                          className="pr-10"
                          data-testid="input-custom-symptom"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={addCustomSymptom}
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          data-testid="button-add-symptom"
                        >
                          <Plus className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>

                      {/* Selected Symptoms Display */}
                      {selectedSymptoms.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-gray-600">Selected symptoms:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSymptoms.map((symptom) => (
                              <Badge 
                                key={symptom} 
                                variant="secondary" 
                                className="text-xs"
                                data-testid={`badge-symptom-${symptom.toLowerCase().replace(/\s+/g, '-')}`}
                              >
                                {symptom}
                                <button
                                  type="button"
                                  onClick={() => handleSymptomToggle(symptom, false)}
                                  className="ml-1 hover:text-red-500"
                                  data-testid={`button-remove-${symptom.toLowerCase().replace(/\s+/g, '-')}`}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Patient Demographics */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="25"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                data-testid="input-age"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-gender">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Analyze Button */}
                    <Button 
                      type="submit"
                      disabled={diagnosisMutation.isPending}
                      className="w-full bg-medical-blue hover:bg-blue-700 text-white py-3"
                      data-testid="button-analyze"
                    >
                      {diagnosisMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4" />
                          Generate Differential Diagnosis
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Medical Disclaimer */}
            <Alert className="mt-6 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                <span className="font-medium">Medical Disclaimer:</span> This tool provides educational information only and should not replace professional medical advice. Always consult with a qualified healthcare provider for medical diagnosis and treatment.
              </AlertDescription>
            </Alert>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center">
                    <ClipboardList className="text-healthcare-green h-5 w-5 mr-3" />
                    Differential Diagnosis Results
                  </div>
                  {diagnosisResults && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      <span data-testid="text-analysis-time">
                        {new Date(diagnosisResults.analysisTimestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {diagnosisResults ? (
                  <div className="space-y-6">
                    {/* Analysis Summary */}
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertTriangle className="h-4 w-4 text-medical-blue" />
                      <AlertDescription className="text-blue-700">
                        <span className="font-medium">Analysis Summary:</span> {diagnosisResults.summary}
                      </AlertDescription>
                    </Alert>

                    {/* Results List */}
                    <div className="space-y-4">
                      {diagnosisResults.results.map((diagnosis, index) => (
                        <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                                  index === 0 ? 'bg-alert-red text-white' : 
                                  index === 1 ? 'bg-amber-500 text-white' : 
                                  'bg-healthcare-green text-white'
                                }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-dark-slate text-lg" data-testid={`text-diagnosis-${index}`}>
                                    {diagnosis.condition}
                                  </h3>
                                  <div className="flex items-center mt-1">
                                    {renderStars(diagnosis.probability)}
                                    <span className="text-sm text-gray-600 ml-2">
                                      {diagnosis.probability >= 80 ? 'High' : diagnosis.probability >= 50 ? 'Medium' : 'Low'} Probability ({diagnosis.probability}%)
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Badge className={`${getUrgencyColor(diagnosis.urgency)} px-3 py-1 text-xs font-medium`}>
                                {diagnosis.urgency.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-3" data-testid={`text-explanation-${index}`}>
                              {diagnosis.explanation}
                            </p>
                            <div className="space-y-2">
                              {diagnosis.matchingSymptoms.length > 0 && (
                                <div className="flex items-center text-sm">
                                  <CheckCircle className="text-success-green mr-2 h-4 w-4" />
                                  <span className="text-gray-600">
                                    Matches: {diagnosis.matchingSymptoms.join(", ")}
                                  </span>
                                </div>
                              )}
                              {diagnosis.recommendations.length > 0 && (
                                <div className="flex items-start text-sm">
                                  {getUrgencyIcon(diagnosis.urgency)}
                                  <span className="text-gray-600 ml-2">
                                    {diagnosis.recommendations[0]}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Action Recommendations */}
                    {diagnosisResults.recommendations.length > 0 && (
                      <Card className="bg-gray-50 border-gray-200">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-dark-slate mb-3 flex items-center">
                            <Lightbulb className="text-amber-500 mr-2 h-4 w-4" />
                            Recommended Next Steps
                          </h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            {diagnosisResults.recommendations.map((recommendation, index) => (
                              <li key={index} className="flex items-start" data-testid={`text-recommendation-${index}`}>
                                <span className="w-2 h-2 bg-medical-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>{recommendation}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Brain className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Yet</h3>
                    <p className="text-sm">Enter your symptoms and click "Generate Differential Diagnosis" to get AI-powered medical analysis.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <BriefcaseMedical className="text-medical-blue h-5 w-5 mr-3" />
                <h3 className="font-semibold text-dark-slate">Medical Resources</h3>
              </div>
              <div className="w-full h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg mb-3 flex items-center justify-center">
                <Stethoscope className="h-8 w-8 text-medical-blue" />
              </div>
              <p className="text-sm text-gray-600 mb-3">Access comprehensive medical information and treatment guidelines.</p>
              <Button variant="link" className="text-medical-blue p-0 h-auto font-medium">
                Learn More →
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <UserRound className="text-healthcare-green h-5 w-5 mr-3" />
                <h3 className="font-semibold text-dark-slate">Find Specialists</h3>
              </div>
              <div className="w-full h-32 bg-gradient-to-r from-green-100 to-green-200 rounded-lg mb-3 flex items-center justify-center">
                <UserRound className="h-8 w-8 text-healthcare-green" />
              </div>
              <p className="text-sm text-gray-600 mb-3">Connect with qualified medical specialists in your area.</p>
              <Button variant="link" className="text-healthcare-green p-0 h-auto font-medium">
                Find Doctors →
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Heart className="text-alert-red h-5 w-5 mr-3" />
                <h3 className="font-semibold text-dark-slate">Emergency Care</h3>
              </div>
              <div className="w-full h-32 bg-gradient-to-r from-red-100 to-red-200 rounded-lg mb-3 flex items-center justify-center">
                <Heart className="h-8 w-8 text-alert-red" />
              </div>
              <p className="text-sm text-gray-600 mb-3">Know when to seek immediate medical attention for urgent symptoms.</p>
              <Button variant="link" className="text-alert-red p-0 h-auto font-medium">
                Emergency Guide →
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Stethoscope className="text-medical-blue h-5 w-5 mr-2" />
                <span className="font-semibold text-dark-slate">MedAI Diagnosis</span>
              </div>
              <p className="text-sm text-gray-600">AI-powered medical diagnosis assistance for healthcare professionals and informed patients.</p>
            </div>
            <div>
              <h4 className="font-medium text-dark-slate mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-medical-blue">Medical Guidelines</a></li>
                <li><a href="#" className="hover:text-medical-blue">Drug Interactions</a></li>
                <li><a href="#" className="hover:text-medical-blue">Symptom Checker</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-dark-slate mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-medical-blue">Help Center</a></li>
                <li><a href="#" className="hover:text-medical-blue">Contact Us</a></li>
                <li><a href="#" className="hover:text-medical-blue">Feedback</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-dark-slate mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-medical-blue">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-medical-blue">Terms of Service</a></li>
                <li><a href="#" className="hover:text-medical-blue">Medical Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© 2024 MedAI Diagnosis. All rights reserved.</p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-sm text-gray-500 mr-4">Powered by AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
