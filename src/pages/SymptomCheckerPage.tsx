import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { PCOS_TYPES, SYMPTOMS } from '@/lib/constants';
import { PCOSType } from '@/types';

const stepsSchema = [
  z.object({
    cycleRegularity: z.enum(['regular', 'irregular', 'very-irregular', 'absent']),
  }),
  z.object({
    physicalSymptoms: z.array(z.string()).min(1, 'Please select at least one symptom'),
  }),
  z.object({
    mentalSymptoms: z.array(z.string()),
    weightChanges: z.enum(['gain', 'loss', 'fluctuating', 'none']),
  }),
  z.object({
    sugarCravings: z.enum(['none', 'mild', 'moderate', 'severe']),
    energyLevels: z.enum(['high', 'normal', 'low', 'very-low']),
  }),
  z.object({
    stressLevel: z.enum(['low', 'moderate', 'high', 'very-high']),
    sleepQuality: z.enum(['good', 'fair', 'poor', 'very-poor']),
  }),
];

const FormStep1 = ({ form }: { form: any }) => (
  <>
    <FormField
      control={form.control}
      name="cycleRegularity"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>How would you describe your menstrual cycle regularity?</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="regular" />
                </FormControl>
                <FormLabel className="font-normal">
                  Regular (every 21-35 days)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="irregular" />
                </FormControl>
                <FormLabel className="font-normal">
                  Somewhat irregular (varies by a week or more)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="very-irregular" />
                </FormControl>
                <FormLabel className="font-normal">
                  Very irregular (unpredictable)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="absent" />
                </FormControl>
                <FormLabel className="font-normal">
                  Absent (no periods for 3+ months)
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

const FormStep2 = ({ form }: { form: any }) => {
  const physicalSymptomsList = SYMPTOMS.filter(s => s.category === 'physical');
  
  return (
    <>
      <FormField
        control={form.control}
        name="physicalSymptoms"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Which physical symptoms do you experience?</FormLabel>
              <FormDescription>
                Select all that apply to you
              </FormDescription>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {physicalSymptomsList.map((symptom) => (
                <FormField
                  key={symptom.id}
                  control={form.control}
                  name="physicalSymptoms"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={symptom.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(symptom.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, symptom.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== symptom.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {symptom.name}
                          <p className="text-xs text-muted-foreground">{symptom.description}</p>
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const FormStep3 = ({ form }: { form: any }) => {
  const mentalSymptomsList = SYMPTOMS.filter(s => s.category === 'mental');
  
  return (
    <>
      <FormField
        control={form.control}
        name="mentalSymptoms"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Which mental/emotional symptoms do you experience?</FormLabel>
              <FormDescription>
                Select all that apply to you
              </FormDescription>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mentalSymptomsList.map((symptom) => (
                <FormField
                  key={symptom.id}
                  control={form.control}
                  name="mentalSymptoms"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={symptom.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(symptom.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, symptom.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== symptom.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {symptom.name}
                          <p className="text-xs text-muted-foreground">{symptom.description}</p>
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="weightChanges"
        render={({ field }) => (
          <FormItem className="mt-6">
            <FormLabel>Have you experienced any weight changes?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select weight change pattern" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="gain">Weight gain (especially around midsection)</SelectItem>
                <SelectItem value="loss">Weight loss</SelectItem>
                <SelectItem value="fluctuating">Fluctuating weight</SelectItem>
                <SelectItem value="none">No significant changes</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const FormStep4 = ({ form }: { form: any }) => (
  <>
    <FormField
      control={form.control}
      name="sugarCravings"
      render={({ field }) => (
        <FormItem>
          <FormLabel>How would you rate your sugar or carb cravings?</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select craving intensity" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">None - I rarely crave sweets</SelectItem>
              <SelectItem value="mild">Mild - Occasional cravings</SelectItem>
              <SelectItem value="moderate">Moderate - Regular cravings</SelectItem>
              <SelectItem value="severe">Severe - Strong, frequent cravings</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="energyLevels"
      render={({ field }) => (
        <FormItem className="mt-6">
          <FormLabel>How would you describe your energy levels?</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select energy level" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="high">High - Energetic most of the day</SelectItem>
              <SelectItem value="normal">Normal - Generally good energy</SelectItem>
              <SelectItem value="low">Low - Often tired</SelectItem>
              <SelectItem value="very-low">Very low - Exhausted most days</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

const FormStep5 = ({ form }: { form: any }) => (
  <>
    <FormField
      control={form.control}
      name="stressLevel"
      render={({ field }) => (
        <FormItem>
          <FormLabel>How would you rate your stress levels?</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select stress level" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="low">Low - Rarely feel stressed</SelectItem>
              <SelectItem value="moderate">Moderate - Occasionally stressed</SelectItem>
              <SelectItem value="high">High - Often stressed</SelectItem>
              <SelectItem value="very-high">Very high - Constantly stressed</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="sleepQuality"
      render={({ field }) => (
        <FormItem className="mt-6">
          <FormLabel>How would you describe your sleep quality?</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select sleep quality" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="good">Good - Fall asleep easily and wake refreshed</SelectItem>
              <SelectItem value="fair">Fair - Occasional sleep issues</SelectItem>
              <SelectItem value="poor">Poor - Frequent trouble sleeping</SelectItem>
              <SelectItem value="very-poor">Very poor - Severe insomnia or sleep disturbances</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

export function SymptomCheckerPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PCOSType | null>(null);
  
  const formSteps = [
    FormStep1, 
    FormStep2, 
    FormStep3, 
    FormStep4, 
    FormStep5
  ];
  
  const form = useForm({
    resolver: zodResolver(stepsSchema[step]),
    defaultValues: {
      cycleRegularity: undefined,
      physicalSymptoms: [],
      mentalSymptoms: [],
      weightChanges: undefined,
      sugarCravings: undefined,
      energyLevels: undefined,
      stressLevel: undefined,
      sleepQuality: undefined,
    },
  });

  const CurrentStepForm = formSteps[step];

  const next = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    if (step < formSteps.length - 1) {
      setStep(step + 1);
    } else {
      // Submit the form and calculate results
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple algorithm to determine PCOS type based on symptoms
      // In a real app, this would be more sophisticated
      const formData = form.getValues();
      
      let pcosType: PCOSType;
      
      if (
        formData.sugarCravings === 'severe' || 
        formData.sugarCravings === 'moderate' || 
        formData.weightChanges === 'gain' || 
        formData.energyLevels === 'low'
      ) {
        pcosType = PCOS_TYPES.find(t => t.id === 'insulin-resistant')!;
      } else if (
        formData.stressLevel === 'high' || 
        formData.stressLevel === 'very-high' || 
        formData.sleepQuality === 'poor'
      ) {
        pcosType = PCOS_TYPES.find(t => t.id === 'adrenal')!;
      } else if (
        formData.physicalSymptoms.includes('acne') || 
        formData.physicalSymptoms.includes('weight-gain')
      ) {
        pcosType = PCOS_TYPES.find(t => t.id === 'inflammatory')!;
      } else {
        pcosType = PCOS_TYPES.find(t => t.id === 'post-pill')!;
      }
      
      setResult(pcosType);
      setLoading(false);
    }
  };

  const back = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const restart = () => {
    form.reset();
    setStep(0);
    setResult(null);
  };

  return (
    <MainLayout requireAuth>
      <div className="container py-8 max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">PCOS Symptom Checker</h1>
          <p className="text-muted-foreground">
            Answer the questions below to help identify your PCOS type and receive personalized recommendations.
          </p>
        </div>

        {!result ? (
          <Card>
            <CardHeader>
              <CardTitle>Step {step + 1} of {formSteps.length}</CardTitle>
              <CardDescription>
                {step === 0 && 'Let\'s start with your cycle patterns'}
                {step === 1 && 'Tell us about your physical symptoms'}
                {step === 2 && 'Let\'s discuss mental symptoms and weight changes'}
                {step === 3 && 'Information about cravings and energy'}
                {step === 4 && 'Almost done! Let\'s talk about stress and sleep'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <CurrentStepForm form={form} />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={back} 
                disabled={step === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={next} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : step < formSteps.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  'Complete & Get Results'
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-lavender-50 to-pink-50">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl">Your Results</CardTitle>
              <CardDescription className="text-center">
                Based on your symptoms, you may have:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-bold text-primary">{result.name}</h3>
                <p className="mb-4 text-muted-foreground">{result.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium">Common Symptoms:</h4>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    {result.commonSymptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary"></span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Recommendations:</h4>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>This is not a medical diagnosis. Please consult with a healthcare provider for proper evaluation.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={restart}>Start Over</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}