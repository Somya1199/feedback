// src/components/BulkUploadAnalytics.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Loader2, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  AlertCircle,
  MessageSquare,
  Info,
  RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';

interface UploadedData {
  fileName: string;
  data: any[];
  headers: string[];
  rowCount: number;
}

interface LeaderAnalytics {
  email: string;
  name: string;
  feedbackCount: number;
  uniqueRespondents: number;
  avgScore: number;
  saFeedbackCount: number;
  aFeedbackCount: number;
  nFeedbackCount: number;
  dFeedbackCount: number;
  sdFeedbackCount: number;
  saFeedbackPercent: number;
  aFeedbackPercent: number;
  nFeedbackPercent: number;
  dFeedbackPercent: number;
  sdFeedbackPercent: number;
  saQuestionCount: number;
  aQuestionCount: number;
  nQuestionCount: number;
  dQuestionCount: number;
  sdQuestionCount: number;
  saQuestionPercent: number;
  aQuestionPercent: number;
  nQuestionPercent: number;
  dQuestionPercent: number;
  sdQuestionPercent: number;
  totalQuestionResponses: number;
  riskScore: number;
  riskLevel: string;
}

interface GenderData {
  [key: string]: {
    peopleCount: number;
    avgQuestionsPerPerson: number;
    avgScore: number;
    avgSdPercent: number;
    avgDPercent: number;
    avgNPercent: number;
    avgAPercent: number;
    avgSaPercent: number;
  }
}

interface TenureData {
  [key: string]: {
    peopleCount: number;
    avgQuestionsPerPerson: number;
    avgScore: number;
    avgSdPercent: number;
    avgDPercent: number;
    avgNPercent: number;
    avgAPercent: number;
    avgSaPercent: number;
  }
}

interface QuestionMetric {
  question: string;
  meanScore: number;
  stdDev: number;
  count: number;
}

interface SentimentData {
  type: string;
  count: number;
  percentage: number;
}

const BulkUploadAnalytics = () => {
  const { toast } = useToast();
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<string>('all');
  const [leaderAnalytics, setLeaderAnalytics] = useState<LeaderAnalytics[]>([]);
  const [genderData, setGenderData] = useState<GenderData>({});
  const [tenureData, setTenureData] = useState<TenureData>({});
  const [questionMetrics, setQuestionMetrics] = useState<QuestionMetric[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [globalRiskScore, setGlobalRiskScore] = useState(0);
  const [riskBuckets, setRiskBuckets] = useState({ low: 0, medium: 0, high: 0 });
  const [highRiskLeaders, setHighRiskLeaders] = useState<any[]>([]);

  const emailToName = (email: string) => {
    if (!email || !email.includes('@')) return email;
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  };

  const convertResponseToScore = (response: string): number => {
    switch (response) {
      case 'Strongly Disagree': return 1;
      case 'Disagree': return 2;
      case 'Neutral': return 3;
      case 'Agree': return 4;
      case 'Strongly Agree': return 5;
      default: return 3;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          toast({
            title: 'Error',
            description: 'File must contain headers and at least one row of data',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];

        const formattedData = rows.map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });

        const uploaded: UploadedData = {
          fileName: file.name,
          data: formattedData,
          headers,
          rowCount: formattedData.length
        };

        setUploadedData(uploaded);
        calculateAnalytics(uploaded.data);

        toast({
          title: 'File Uploaded Successfully',
          description: `Loaded ${formattedData.length} records from ${file.name}`,
        });
      } catch (error) {
        console.error('Error parsing file:', error);
        toast({
          title: 'Error',
          description: 'Failed to parse file. Please check the format.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const calculateAnalytics = (data: any[]) => {
    // Calculate leader analytics
    const leaders = calculateLeaderAnalyticsByPerson(data);
    setLeaderAnalytics(leaders);

    // Calculate question metrics
    const questions = calculateQuestionMetrics(data);
    setQuestionMetrics(questions);

    // Calculate gender analysis
    const gender = calculateGenderAnalysisByPerson(data);
    setGenderData(gender);

    // Calculate tenure analysis
    const tenure = calculateTenureAnalysisByPerson(data);
    setTenureData(tenure);

    // Calculate comment sentiment
    const sentiment = calculateCommentSentiment(data);
    setSentimentData(sentiment);
    setTotalComments(calculateTotalComments(data));

    // Calculate risk metrics
    const riskScore = calculateGlobalRiskScore(leaders);
    setGlobalRiskScore(riskScore);

    const buckets = calculateRiskBuckets(leaders);
    setRiskBuckets(buckets);

    const highRisk = calculateHighRiskLeaders(leaders);
    setHighRiskLeaders(highRisk);
  };

  const calculateLeaderAnalyticsByPerson = (data: any[]): LeaderAnalytics[] => {
    const leaderMap = new Map<string, {
      email: string,
      name: string,
      feedbacks: any[],
      uniqueRespondents: Set<string>
    }>();

    data.forEach(response => {
      const managerEmail = response['Management Email ID'];

      if (managerEmail && typeof managerEmail === 'string' && managerEmail.includes('@')) {
        const email = managerEmail.trim().toLowerCase();
        const name = emailToName(email);
        const submitterHash = response['Encrypted Submitter ID'];

        if (!leaderMap.has(email)) {
          leaderMap.set(email, {
            email,
            name,
            feedbacks: [],
            uniqueRespondents: new Set()
          });
        }

        const leader = leaderMap.get(email)!;
        leader.feedbacks.push(response);

        if (submitterHash && typeof submitterHash === 'string') {
          leader.uniqueRespondents.add(submitterHash);
        }
      }
    });

    return Array.from(leaderMap.values()).map(leader => {
      let totalRatingSum = 0;
      let feedbacksWithQuestions = 0;

      let sdFeedbackCount = 0, dFeedbackCount = 0, nFeedbackCount = 0, aFeedbackCount = 0, saFeedbackCount = 0;

      let totalQuestions = 0;
      let sdQuestionCount = 0, dQuestionCount = 0, nQuestionCount = 0, aQuestionCount = 0, saQuestionCount = 0;

      leader.feedbacks.forEach(feedback => {
        let feedbackTotal = 0;
        let feedbackQuestionCount = 0;

        let questionSd = 0, questionD = 0, questionN = 0, questionA = 0, questionSa = 0;

        Object.values(feedback).forEach(value => {
          if (typeof value === 'string') {
            switch (value) {
              case 'Strongly Disagree':
                feedbackTotal += 1;
                feedbackQuestionCount++;
                questionSd++;
                break;
              case 'Disagree':
                feedbackTotal += 2;
                feedbackQuestionCount++;
                questionD++;
                break;
              case 'Neutral':
                feedbackTotal += 3;
                feedbackQuestionCount++;
                questionN++;
                break;
              case 'Agree':
                feedbackTotal += 4;
                feedbackQuestionCount++;
                questionA++;
                break;
              case 'Strongly Agree':
                feedbackTotal += 5;
                feedbackQuestionCount++;
                questionSa++;
                break;
            }
          }
        });

        if (feedbackQuestionCount > 0) {
          totalQuestions += feedbackQuestionCount;
          sdQuestionCount += questionSd;
          dQuestionCount += questionD;
          nQuestionCount += questionN;
          aQuestionCount += questionA;
          saQuestionCount += questionSa;

          const avgForFeedback = feedbackTotal / feedbackQuestionCount;
          totalRatingSum += avgForFeedback;
          feedbacksWithQuestions++;

          if (avgForFeedback >= 4.5) {
            saFeedbackCount++;
          } else if (avgForFeedback >= 3.5) {
            aFeedbackCount++;
          } else if (avgForFeedback >= 2.5) {
            nFeedbackCount++;
          } else if (avgForFeedback >= 1.5) {
            dFeedbackCount++;
          } else {
            sdFeedbackCount++;
          }
        }
      });

      const totalFeedbacks = leader.feedbacks.length;
      const avgScore = feedbacksWithQuestions > 0 ? totalRatingSum / feedbacksWithQuestions : 0;

      const saFeedbackPercent = totalFeedbacks > 0 ? (saFeedbackCount / totalFeedbacks) * 100 : 0;
      const aFeedbackPercent = totalFeedbacks > 0 ? (aFeedbackCount / totalFeedbacks) * 100 : 0;
      const nFeedbackPercent = totalFeedbacks > 0 ? (nFeedbackCount / totalFeedbacks) * 100 : 0;
      const dFeedbackPercent = totalFeedbacks > 0 ? (dFeedbackCount / totalFeedbacks) * 100 : 0;
      const sdFeedbackPercent = totalFeedbacks > 0 ? (sdFeedbackCount / totalFeedbacks) * 100 : 0;

      const totalQuestionResponses = sdQuestionCount + dQuestionCount + nQuestionCount + aQuestionCount + saQuestionCount;
      const saQuestionPercent = totalQuestionResponses > 0 ? (saQuestionCount / totalQuestionResponses) * 100 : 0;
      const aQuestionPercent = totalQuestionResponses > 0 ? (aQuestionCount / totalQuestionResponses) * 100 : 0;
      const nQuestionPercent = totalQuestionResponses > 0 ? (nQuestionCount / totalQuestionResponses) * 100 : 0;
      const dQuestionPercent = totalQuestionResponses > 0 ? (dQuestionCount / totalQuestionResponses) * 100 : 0;
      const sdQuestionPercent = totalQuestionResponses > 0 ? (sdQuestionCount / totalQuestionResponses) * 100 : 0;

      const riskScore = Math.max(0, sdQuestionCount * 3 - saQuestionCount);
      let riskLevel = 'Low';
      if (sdQuestionPercent > 30 || sdQuestionCount > 10) riskLevel = 'High';
      else if (sdQuestionPercent > 15 || sdQuestionCount > 5) riskLevel = 'Medium';

      return {
        email: leader.email,
        name: leader.name,
        feedbackCount: leader.feedbacks.length,
        uniqueRespondents: leader.uniqueRespondents.size,
        avgScore: parseFloat(avgScore.toFixed(2)),

        saFeedbackCount,
        aFeedbackCount,
        nFeedbackCount,
        dFeedbackCount,
        sdFeedbackCount,

        saFeedbackPercent: parseFloat(saFeedbackPercent.toFixed(1)),
        aFeedbackPercent: parseFloat(aFeedbackPercent.toFixed(1)),
        nFeedbackPercent: parseFloat(nFeedbackPercent.toFixed(1)),
        dFeedbackPercent: parseFloat(dFeedbackPercent.toFixed(1)),
        sdFeedbackPercent: parseFloat(sdFeedbackPercent.toFixed(1)),

        saQuestionCount,
        aQuestionCount,
        nQuestionCount,
        dQuestionCount,
        sdQuestionCount,

        saQuestionPercent: parseFloat(saQuestionPercent.toFixed(1)),
        aQuestionPercent: parseFloat(aQuestionPercent.toFixed(1)),
        nQuestionPercent: parseFloat(nQuestionPercent.toFixed(1)),
        dQuestionPercent: parseFloat(dQuestionPercent.toFixed(1)),
        sdQuestionPercent: parseFloat(sdQuestionPercent.toFixed(1)),

        totalQuestionResponses,

        riskScore,
        riskLevel
      };
    }).sort((a, b) => b.feedbackCount - a.feedbackCount);
  };

  const calculateQuestionMetrics = (data: any[]): QuestionMetric[] => {
    const questionMap = new Map();

    data.forEach(response => {
      Object.entries(response).forEach(([key, value]) => {
        if (typeof value === 'string' &&
          ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'].includes(value)) {
          if (!questionMap.has(key)) {
            questionMap.set(key, {
              question: key,
              scores: [],
              sum: 0,
              sumSq: 0,
              count: 0
            });
          }

          const question = questionMap.get(key);
          const score = convertResponseToScore(value);
          question.scores.push(score);
          question.sum += score;
          question.sumSq += score * score;
          question.count++;
        }
      });
    });

    return Array.from(questionMap.values()).map(q => {
      const mean = q.count > 0 ? q.sum / q.count : 0;
      const variance = q.count > 0 ? (q.sumSq / q.count) - (mean * mean) : 0;
      const stdDev = Math.sqrt(Math.max(0, variance));

      return {
        question: q.question,
        meanScore: parseFloat(mean.toFixed(2)),
        stdDev: parseFloat(stdDev.toFixed(2)),
        count: q.count
      };
    }).sort((a, b) => b.meanScore - a.meanScore);
  };

  const calculateGenderAnalysisByPerson = (data: any[]): GenderData => {
    const genderMap = new Map<string, {
      peopleCount: number,
      totalQuestions: number,
      totalScore: number,
      sdCount: number,
      dCount: number,
      nCount: number,
      aCount: number,
      saCount: number
    }>();

    data.forEach(response => {
      const gender = (response['Gender'] as string)?.trim() || 'Unknown';
      let genderKey = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

      if (!['Male', 'Female', 'Other', 'Prefer not to say'].includes(genderKey)) {
        if (genderKey === 'Unknown' || !genderKey) {
          genderKey = 'Unknown';
        } else {
          if (genderKey.toLowerCase().includes('female')) genderKey = 'Female';
          else if (genderKey.toLowerCase().includes('male')) genderKey = 'Male';
          else genderKey = 'Unknown';
        }
      }

      if (!genderMap.has(genderKey)) {
        genderMap.set(genderKey, {
          peopleCount: 0,
          totalQuestions: 0,
          totalScore: 0,
          sdCount: 0,
          dCount: 0,
          nCount: 0,
          aCount: 0,
          saCount: 0
        });
      }

      const stats = genderMap.get(genderKey)!;
      stats.peopleCount++;

      let personSd = 0, personD = 0, personN = 0, personA = 0, personSa = 0;
      let personQuestionCount = 0;
      let personTotalScore = 0;

      Object.values(response).forEach(val => {
        if (typeof val === 'string') {
          switch (val) {
            case 'Strongly Disagree':
              personSd++;
              personQuestionCount++;
              personTotalScore += 1;
              break;
            case 'Disagree':
              personD++;
              personQuestionCount++;
              personTotalScore += 2;
              break;
            case 'Neutral':
              personN++;
              personQuestionCount++;
              personTotalScore += 3;
              break;
            case 'Agree':
              personA++;
              personQuestionCount++;
              personTotalScore += 4;
              break;
            case 'Strongly Agree':
              personSa++;
              personQuestionCount++;
              personTotalScore += 5;
              break;
          }
        }
      });

      stats.totalQuestions += personQuestionCount;
      stats.totalScore += personTotalScore;
      stats.sdCount += personSd;
      stats.dCount += personD;
      stats.nCount += personN;
      stats.aCount += personA;
      stats.saCount += personSa;
    });

    const result: GenderData = {};

    genderMap.forEach((stats, gender) => {
      const avgQuestionsPerPerson = stats.peopleCount > 0
        ? stats.totalQuestions / stats.peopleCount
        : 0;

      const avgScore = stats.totalQuestions > 0
        ? stats.totalScore / stats.totalQuestions
        : 0;

      const avgSdPercent = stats.totalQuestions > 0
        ? (stats.sdCount / stats.totalQuestions) * 100
        : 0;

      const avgDPercent = stats.totalQuestions > 0
        ? (stats.dCount / stats.totalQuestions) * 100
        : 0;

      const avgNPercent = stats.totalQuestions > 0
        ? (stats.nCount / stats.totalQuestions) * 100
        : 0;

      const avgAPercent = stats.totalQuestions > 0
        ? (stats.aCount / stats.totalQuestions) * 100
        : 0;

      const avgSaPercent = stats.totalQuestions > 0
        ? (stats.saCount / stats.totalQuestions) * 100
        : 0;

      result[gender] = {
        peopleCount: stats.peopleCount,
        avgQuestionsPerPerson: parseFloat(avgQuestionsPerPerson.toFixed(1)),
        avgScore: parseFloat(avgScore.toFixed(1)),
        avgSdPercent: parseFloat(avgSdPercent.toFixed(1)),
        avgDPercent: parseFloat(avgDPercent.toFixed(1)),
        avgNPercent: parseFloat(avgNPercent.toFixed(1)),
        avgAPercent: parseFloat(avgAPercent.toFixed(1)),
        avgSaPercent: parseFloat(avgSaPercent.toFixed(1))
      };
    });

    return result;
  };

  const calculateTenureAnalysisByPerson = (data: any[]): TenureData => {
    const tenureMap = new Map<string, {
      peopleCount: number,
      totalQuestions: number,
      totalScore: number,
      sdCount: number,
      dCount: number,
      nCount: number,
      aCount: number,
      saCount: number
    }>();

    const tenureBuckets = [
      '0-1 Year',
      '1-3 Years',
      '3-5 Years',
      '5+ Years',
      'Unknown'
    ];

    tenureBuckets.forEach(bucket => {
      tenureMap.set(bucket, {
        peopleCount: 0,
        totalQuestions: 0,
        totalScore: 0,
        sdCount: 0,
        dCount: 0,
        nCount: 0,
        aCount: 0,
        saCount: 0
      });
    });

    data.forEach(response => {
      const tenureValue = response['Tenure'];
      let tenureBucket = 'Unknown';

      if (tenureValue !== undefined && tenureValue !== null && tenureValue !== '') {
        try {
          const tenureNum = typeof tenureValue === 'string'
            ? parseFloat(tenureValue.replace(/[^0-9.]/g, ''))
            : Number(tenureValue);

          if (!isNaN(tenureNum)) {
            if (tenureNum < 1) tenureBucket = '0-1 Year';
            else if (tenureNum < 3) tenureBucket = '1-3 Years';
            else if (tenureNum < 5) tenureBucket = '3-5 Years';
            else tenureBucket = '5+ Years';
          }
        } catch (e) {
          tenureBucket = 'Unknown';
        }
      }

      const stats = tenureMap.get(tenureBucket)!;
      stats.peopleCount++;

      let personSd = 0, personD = 0, personN = 0, personA = 0, personSa = 0;
      let personQuestionCount = 0;
      let personTotalScore = 0;

      Object.values(response).forEach(val => {
        if (typeof val === 'string') {
          switch (val) {
            case 'Strongly Disagree':
              personSd++;
              personQuestionCount++;
              personTotalScore += 1;
              break;
            case 'Disagree':
              personD++;
              personQuestionCount++;
              personTotalScore += 2;
              break;
            case 'Neutral':
              personN++;
              personQuestionCount++;
              personTotalScore += 3;
              break;
            case 'Agree':
              personA++;
              personQuestionCount++;
              personTotalScore += 4;
              break;
            case 'Strongly Agree':
              personSa++;
              personQuestionCount++;
              personTotalScore += 5;
              break;
          }
        }
      });

      stats.totalQuestions += personQuestionCount;
      stats.totalScore += personTotalScore;
      stats.sdCount += personSd;
      stats.dCount += personD;
      stats.nCount += personN;
      stats.aCount += personA;
      stats.saCount += personSa;
    });

    const result: TenureData = {};

    tenureMap.forEach((stats, tenure) => {
      if (stats.peopleCount === 0) {
        result[tenure] = {
          peopleCount: 0,
          avgQuestionsPerPerson: 0,
          avgScore: 0,
          avgSdPercent: 0,
          avgDPercent: 0,
          avgNPercent: 0,
          avgAPercent: 0,
          avgSaPercent: 0
        };
        return;
      }

      const avgQuestionsPerPerson = stats.peopleCount > 0
        ? stats.totalQuestions / stats.peopleCount
        : 0;

      const avgScore = stats.totalQuestions > 0
        ? stats.totalScore / stats.totalQuestions
        : 0;

      const avgSdPercent = stats.totalQuestions > 0
        ? (stats.sdCount / stats.totalQuestions) * 100
        : 0;

      const avgDPercent = stats.totalQuestions > 0
        ? (stats.dCount / stats.totalQuestions) * 100
        : 0;

      const avgNPercent = stats.totalQuestions > 0
        ? (stats.nCount / stats.totalQuestions) * 100
        : 0;

      const avgAPercent = stats.totalQuestions > 0
        ? (stats.aCount / stats.totalQuestions) * 100
        : 0;

      const avgSaPercent = stats.totalQuestions > 0
        ? (stats.saCount / stats.totalQuestions) * 100
        : 0;

      result[tenure] = {
        peopleCount: stats.peopleCount,
        avgQuestionsPerPerson: parseFloat(avgQuestionsPerPerson.toFixed(1)),
        avgScore: parseFloat(avgScore.toFixed(1)),
        avgSdPercent: parseFloat(avgSdPercent.toFixed(1)),
        avgDPercent: parseFloat(avgDPercent.toFixed(1)),
        avgNPercent: parseFloat(avgNPercent.toFixed(1)),
        avgAPercent: parseFloat(avgAPercent.toFixed(1)),
        avgSaPercent: parseFloat(avgSaPercent.toFixed(1))
      };
    });

    const sortedResult: TenureData = {};
    tenureBuckets.forEach(bucket => {
      if (result[bucket]) {
        sortedResult[bucket] = result[bucket];
      }
    });

    return sortedResult;
  };

  const calculateCommentSentiment = (data: any[]): SentimentData[] => {
    const comments = data
      .map(r => r['Additional Comments'] as string)
      .filter(comment => comment && comment.trim().length > 10);

    let positive = 0, negative = 0, neutral = 0;

    comments.forEach(comment => {
      const lowerComment = comment.toLowerCase();
      const positiveWords = ['good', 'great', 'excellent', 'helpful', 'supportive', 'positive', 'thanks', 'thank', 'appreciate'];
      const negativeWords = ['bad', 'poor', 'issue', 'problem', 'negative', 'difficult', 'concern', 'worry', 'stress'];

      const posCount = positiveWords.filter(word => lowerComment.includes(word)).length;
      const negCount = negativeWords.filter(word => lowerComment.includes(word)).length;

      if (posCount > negCount) positive++;
      else if (negCount > posCount) negative++;
      else neutral++;
    });

    const total = comments.length || 1;

    return [
      { type: 'Positive', count: positive, percentage: Math.round((positive / total) * 100) },
      { type: 'Neutral', count: neutral, percentage: Math.round((neutral / total) * 100) },
      { type: 'Negative', count: negative, percentage: Math.round((negative / total) * 100) }
    ];
  };

  const calculateTotalComments = (data: any[]): number => {
    return data.filter(r => r['Additional Comments'] &&
      (r['Additional Comments'] as string).trim().length > 10).length;
  };

  const calculateGlobalRiskScore = (leaders: LeaderAnalytics[]): number => {
    const highRiskCount = leaders.filter(l => l.riskLevel === 'High').length;
    return Math.min(100, Math.round((highRiskCount / leaders.length) * 100));
  };

  const calculateRiskBuckets = (leaders: LeaderAnalytics[]) => {
    return {
      low: leaders.filter(l => l.riskLevel === 'Low').length,
      medium: leaders.filter(l => l.riskLevel === 'Medium').length,
      high: leaders.filter(l => l.riskLevel === 'High').length
    };
  };

  const calculateHighRiskLeaders = (leaders: LeaderAnalytics[]) => {
    return leaders
      .map(leader => {
        const riskScore = Math.max(0, leader.sdQuestionCount * 5 - leader.saQuestionCount);

        let actionNeeded = 'Low';
        if (leader.sdQuestionCount > 10) actionNeeded = 'High';
        else if (leader.sdQuestionCount > 5) actionNeeded = 'Medium';

        let riskLevel = 'Low';
        const sdPercent = leader.totalQuestionResponses > 0 ? (leader.sdQuestionCount / leader.totalQuestionResponses) * 100 : 0;
        if (sdPercent > 30 || leader.sdQuestionCount > 10) riskLevel = 'High';
        else if (sdPercent > 15 || leader.sdQuestionCount > 5) riskLevel = 'Medium';

        return {
          name: leader.name,
          sdCount: leader.sdQuestionCount,
          saCount: leader.saQuestionCount,
          riskScore: riskScore,
          actionNeeded: actionNeeded,
          riskLevel: riskLevel,
          sdPercent: parseFloat(sdPercent.toFixed(1))
        };
      })
      .sort((a, b) => b.riskScore - a.riskScore);
  };

  const getUniqueLeaders = () => {
    return leaderAnalytics.map(leader => ({
      email: leader.email,
      name: leader.name,
      feedbackCount: leader.feedbackCount
    }));
  };

  const downloadTemplate = () => {
    const template = [
      {
        'Timestamp': '2024-01-15',
        'Encrypted Submitter ID': 'user123',
        'Role Reviewed': 'Manager',
        'Gender': 'Female',
        'Tenure': '3',
        'Designation/Level': 'Senior Associate',
        'Age': '32',
        'Rating': '4',
        'Process': 'Operations',
        'Gender of the user': 'Female',
        'Management Email ID': 'manager@company.com',
        'Support for personal and professional development': 'Agree',
        'Feedback that contributes to skill growth': 'Strongly Agree',
        'Encouragement for continuous learning - regular syncs': 'Agree',
        'Clarity in discussing development goals': 'Neutral',
        'Availability of opportunities or resources for career growth': 'Agree',
        'Comfort in career-related discussions': 'Strongly Agree',
        'Clear identification of strengths and improvement areas': 'Agree',
        'Clarity of goals and priorities': 'Agree',
        'Timely sharing of updates': 'Agree',
        'Openness to questions and clarification': 'Strongly Agree',
        'Transparency in information sharing': 'Agree',
        'Responsiveness to concerns': 'Agree',
        'Overall communication effectiveness': 'Agree',
        'Availability of support when needed': 'Strongly Agree',
        'Demonstration of concern for well-being': 'Agree',
        'Ease of seeking guidance': 'Agree',
        'Effectiveness in resolving challenges': 'Agree',
        'Support for work-life balance': 'Neutral',
        'Fair distribution of workload': 'Agree',
        'Support in prioritizing tasks': 'Agree',
        'Identification and management of overload': 'Neutral',
        'Encouragement to voice capacity concerns': 'Agree',
        'Realistic deadlines and expectations': 'Agree',
        'Clear direction for work activities': 'Agree',
        'Informed and timely decisions': 'Agree',
        'Confidence in leadership': 'Agree',
        'Promotion of motivation and inspiration': 'Agree',
        'Demonstration of leadership through actions': 'Agree',
        'Regular performance feedback': 'Agree',
        'Constructive and actionable feedback': 'Agree',
        'Improvement through performance discussions': 'Agree',
        'Recognition of achievements': 'Agree',
        'Review of performance goals when needed': 'Agree',
        'Fair treatment of individuals': 'Agree',
        'Consistent demonstration of respect': 'Strongly Agree',
        'Avoidance of favoritism': 'Agree',
        'Value given to contributions and opinions': 'Agree',
        'Promotion of inclusion': 'Agree',
        'Encouragement of a positive work environment': 'Agree',
        'Fair and timely handling of conflicts': 'Neutral',
        'Support for collaboration': 'Agree',
        'A safe and inclusive environment': 'Strongly Agree',
        'Fostering of trust': 'Agree',
        'Effective handling of roadblocks': 'Agree',
        'Involvement of relevant individuals in issue resolution': 'Agree',
        'Encouragement of analytical thinking': 'Agree',
        'Comfort in raising issues': 'Agree',
        'Clarity of responsibilities': 'Agree',
        'Consistency in upholding commitments': 'Agree',
        'Ownership of outcomes': 'Agree',
        'Overall effectiveness of leadership': 'Agree',
        'Positive experience working within the current environment': 'Agree',
        'Positive impact on job satisfaction': 'Agree',
        'Additional Comments': 'Great manager who provides clear guidance and support.'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'feedback_template.xlsx');
  };

  const handleReset = () => {
    setUploadedData(null);
    setLeaderAnalytics([]);
    setGenderData({});
    setTenureData({});
    setQuestionMetrics([]);
    setSentimentData([]);
    setTotalComments(0);
    setGlobalRiskScore(0);
    setRiskBuckets({ low: 0, medium: 0, high: 0 });
    setHighRiskLeaders([]);
    setSelectedLeader('all');
  };

  if (!uploadedData) {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Bulk Upload Analytics</h2>
          <Button onClick={downloadTemplate} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="py-16 text-center">
            <input
              type="file"
              id="file-upload"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              disabled={loading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex flex-col items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-16 h-16 text-secondary mb-4 animate-spin" />
                  <p className="text-lg font-medium text-secondary">Processing...</p>
                  <p className="text-sm text-muted-foreground mt-2">Please wait while we analyze your file</p>
                </>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-secondary mb-4" />
                  <p className="text-lg font-medium text-secondary">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground mt-2">CSV, Excel files (XLSX, XLS)</p>
                  <p className="text-xs text-muted-foreground mt-1">Maximum file size: 10MB</p>
                </>
              )}
            </label>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800">File Format Requirements</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
                <li>First row must contain column headers</li>
                <li>Required columns: Management Email ID, Gender, Tenure, Process, Encrypted Submitter ID</li>
                <li>Question columns should contain: Strongly Agree, Agree, Neutral, Disagree, Strongly Disagree</li>
                <li>Download the template for the exact format</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalResponses = uploadedData.data.length;
  const uniqueSubmitters = new Set(uploadedData.data.map(r => r['Encrypted Submitter ID'] as string).filter(Boolean)).size;
  const positiveFeedback = (() => {
    let positiveCount = 0;
    let totalQuestions = 0;
    uploadedData.data.forEach(response => {
      Object.values(response).forEach(value => {
        if (typeof value === 'string') {
          if (value === 'Agree' || value === 'Strongly Agree') {
            positiveCount++;
          }
          if (['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'].includes(value)) {
            totalQuestions++;
          }
        }
      });
    });
    return totalQuestions > 0 ? Math.round((positiveCount / totalQuestions) * 100) : 0;
  })();

  const uniqueManagers = new Set(uploadedData.data.map(r => r['Management Email ID'] as string).filter(Boolean)).size;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header with file info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Bulk Upload Analytics</h2>
          <div className="flex items-center gap-2 mt-1">
            <FileSpreadsheet className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">{uploadedData.fileName}</span>
            {/* <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
              {uploadedData.rowCount} records
            </span> */}
          </div>
        </div>
        <div className="flex gap-2">
          {/* <Button onClick={downloadTemplate} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Template
          </Button> */}
          <Button onClick={handleReset} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Upload New File
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <span className="text-3xl font-bold text-blue-600">{uniqueSubmitters}</span>
              <span className="text-sm text-muted-foreground block">Unique Submitters</span>
              <span className="text-xs text-gray-500">{totalResponses} total responses</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <span className="text-3xl font-bold text-green-600">{positiveFeedback}%</span>
              <span className="text-sm text-muted-foreground block">Positive Feedback</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <span className="text-3xl font-bold text-purple-600">{uniqueManagers}</span>
              <span className="text-sm text-muted-foreground block">Unique Managers</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <span className="text-3xl font-bold text-orange-600">{totalComments}</span>
              <span className="text-sm text-muted-foreground block">Comments</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leader Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Leader Insights</CardTitle>
          <CardDescription>
            {selectedLeader === 'all'
              ? 'Overview of all leaders in uploaded data. Select a leader for individual insights.'
              : `Viewing insights for ${emailToName(selectedLeader)}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <select
                className="flex-1 p-2 border rounded-md bg-white"
                value={selectedLeader}
                onChange={(e) => setSelectedLeader(e.target.value)}
              >
                <option value="all">Global Overview (All Leaders)</option>
                {getUniqueLeaders().map(leader => (
                  <option key={leader.email} value={leader.email}>
                    {leader.name} ({leader.feedbackCount} feedbacks)
                  </option>
                ))}
              </select>
              <Button
                onClick={() => setSelectedLeader('all')}
                variant="outline"
                className="whitespace-nowrap"
              >
                Clear Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Leader View or Global Overview */}
      {selectedLeader !== 'all' ? (
        <div>
          {(() => {
            const leaderData = leaderAnalytics.find(l => l.email === selectedLeader);
            if (!leaderData) {
              return (
                <div className="text-center py-12 border rounded-lg">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No data available for this leader</h3>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                {/* Leader Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <span className="text-3xl font-bold text-blue-600">
                          {leaderData.feedbackCount || 0}
                        </span>
                        <span className="text-sm text-muted-foreground block">Total Feedbacks</span>
                        <span className="text-xs text-gray-500">
                          {leaderData.uniqueRespondents || 0} unique respondents
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <span className={`text-3xl font-bold ${leaderData.avgScore >= 4 ? 'text-green-600' :
                          leaderData.avgScore >= 3 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                          {leaderData.avgScore?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-sm text-muted-foreground block">Average Score</span>
                        <span className="text-xs text-gray-500">Out of 5.0</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <span className="text-3xl font-bold text-red-600">
                          {leaderData.sdQuestionCount || 0}
                        </span>
                        <span className="text-sm text-muted-foreground block">Strongly Disagree</span>
                        <span className="text-xs text-gray-500">
                          {leaderData.sdQuestionPercent?.toFixed(1) || 0}% of questions
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <span className="text-3xl font-bold text-green-600">
                          {leaderData.saQuestionCount || 0}
                        </span>
                        <span className="text-sm text-muted-foreground block">Strongly Agree</span>
                        <span className="text-xs text-gray-500">
                          {leaderData.saQuestionPercent?.toFixed(1) || 0}% of questions
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Question Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Question Response Distribution</CardTitle>
                    <CardDescription>
                      How respondents answered questions for {emailToName(selectedLeader)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { key: 'saQuestion', label: 'Strongly Agree', color: 'bg-green-600', textColor: 'text-green-600' },
                        { key: 'aQuestion', label: 'Agree', color: 'bg-green-400', textColor: 'text-green-400' },
                        { key: 'nQuestion', label: 'Neutral', color: 'bg-yellow-400', textColor: 'text-yellow-600' },
                        { key: 'dQuestion', label: 'Disagree', color: 'bg-orange-400', textColor: 'text-orange-600' },
                        { key: 'sdQuestion', label: 'Strongly Disagree', color: 'bg-red-500', textColor: 'text-red-600' },
                      ].map((responseType) => {
                        const percent = leaderData[`${responseType.key}Percent`] || 0;
                        const count = leaderData[`${responseType.key}Count`] || 0;

                        return (
                          <div key={responseType.key} className="flex items-center gap-4">
                            <div className="w-32 text-sm font-medium">{responseType.label}</div>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className={responseType.textColor}>
                                  {percent.toFixed(1)}%
                                </span>
                                <span className="text-gray-600">{count} questions</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-3 rounded-full ${responseType.color}`}
                                  style={{ width: `${Math.min(percent, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Analysis Dashboard</CardTitle>
                    <small><i>The Risk Score is a "concern meter" for leaders. <b>Higher score = more problems</b>.</i></small>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Individual Risk Score</span>
                        <span className={`text-2xl font-bold ${leaderData.riskLevel === 'High' ? 'text-red-600' :
                          leaderData.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                          {leaderData.riskScore || 0}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${leaderData.riskLevel === 'High' ? 'bg-red-500' :
                            leaderData.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          style={{ width: `${Math.min(leaderData.riskScore || 0, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <h5 className="font-medium mb-2 text-gray-700">Risk Factors</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Strongly Disagree Responses</span>
                          <span className={`font-bold ${leaderData.sdQuestionCount > 10 ? 'text-red-600' :
                            leaderData.sdQuestionCount > 5 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                            {leaderData.sdQuestionCount} ({leaderData.sdQuestionPercent?.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Strongly Agree Responses</span>
                          <span className={`font-bold ${leaderData.saQuestionCount < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {leaderData.saQuestionCount} ({leaderData.saQuestionPercent?.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Score</span>
                          <span className={`font-bold ${leaderData.avgScore >= 4 ? 'text-green-600' :
                            leaderData.avgScore >= 3 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {leaderData.avgScore?.toFixed(1)}/5.0
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Risk Level</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${leaderData.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                            leaderData.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                            {leaderData.riskLevel || 'Low'} Risk
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })()}
        </div>
      ) : (
        /* Global Overview */
        <div className="space-y-6">
          {/* Question Performance Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Question Performance Analysis</CardTitle>
              <CardDescription>Mean scores and consistency across questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium">Question</th>
                      <th className="text-left py-3 font-medium">Mean Score</th>
                      <th className="text-left py-3 font-medium">Std Dev</th>
                      <th className="text-left py-3 font-medium">Responses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionMetrics.slice(0, 20).map((metric, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="py-3 font-medium max-w-xs truncate" title={metric.question}>
                          {metric.question.length > 50 ? metric.question.substring(0, 47) + '...' : metric.question}
                        </td>
                        <td className="py-3">
                          <span className={`font-bold ${metric.meanScore >= 4 ? 'text-green-600' :
                            metric.meanScore >= 3 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {metric.meanScore.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={metric.stdDev > 1.5 ? 'text-yellow-600' : 'text-green-600'}>
                            {metric.stdDev.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3">{metric.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {questionMetrics.length > 20 && (
                  <div className="mt-4 text-sm text-muted-foreground text-center">
                    Showing 20 of {questionMetrics.length} questions
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gender and Tenure Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gender Analysis</CardTitle>
                <CardDescription>Response distribution by gender</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(genderData).map(([gender, data]) => (
                    <div key={gender} className="pb-4 border-b last:border-b-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{gender}</span>
                        <span className="text-sm font-bold">{data.peopleCount} people</span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Average Score</span>
                          <span className={`font-medium ${data.avgScore >= 4 ? 'text-green-600' :
                            data.avgScore >= 3 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {data.avgScore.toFixed(1)}/5
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${data.avgScore >= 4 ? 'bg-green-600' :
                              data.avgScore >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${(data.avgScore / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-1 text-xs mt-2">
                        <div className="text-center">
                          <div className="text-red-600 font-medium">{data.avgSdPercent.toFixed(0)}%</div>
                          <div className="text-gray-500">SD</div>
                        </div>
                        <div className="text-center">
                          <div className="text-orange-600 font-medium">{data.avgDPercent.toFixed(0)}%</div>
                          <div className="text-gray-500">D</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-600 font-medium">{data.avgNPercent.toFixed(0)}%</div>
                          <div className="text-gray-500">N</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-600 font-medium">{data.avgAPercent.toFixed(0)}%</div>
                          <div className="text-gray-500">A</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-700 font-medium">{data.avgSaPercent.toFixed(0)}%</div>
                          <div className="text-gray-500">SA</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tenure Analysis</CardTitle>
                <CardDescription>Response distribution by tenure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(tenureData).map(([tenure, data]) => (
                    <div key={tenure} className="pb-4 border-b last:border-b-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{tenure}</span>
                        <span className="text-sm font-bold">{data.peopleCount} people</span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Average Score</span>
                          <span className={`font-medium ${data.avgScore >= 4 ? 'text-green-600' :
                            data.avgScore >= 3 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {data.avgScore.toFixed(1)}/5
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${data.avgScore >= 4 ? 'bg-green-600' :
                              data.avgScore >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${(data.avgScore / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-1 text-xs mt-2">
                        <div className="text-center">
                          <div className="text-red-600 font-medium">{data.avgSdPercent.toFixed(0)}%</div>
                          <div className="text-gray-500">SD</div>
                        </div>
                        <div className="text-center">
                          <div className="text-orange-600 font-medium">{data.avgDPercent.toFixed(0)}%</div>
                          <div className="text-gray-500">D</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-600 font-medium">{data.avgNPercent.toFixed(0)}%</div>
                          <div className="text-gray-500">N</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-600 font-medium">{data.avgAPercent.toFixed(0)}%</div>
                          <div className="text-gray-500">A</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-700 font-medium">{data.avgSaPercent.toFixed(0)}%</div>
                          <div className="text-gray-500">SA</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comment Sentiment */}
          <Card>
            <CardHeader>
              <CardTitle>Comment Sentiment Analysis</CardTitle>
              <CardDescription>Sentiment analysis of written comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sentimentData.map((sentiment, idx) => (
                  <div key={idx} className="text-center p-4 rounded-lg border">
                    <div className={`text-2xl font-bold mb-2 ${
                      sentiment.type === 'Positive' ? 'text-green-600' :
                      sentiment.type === 'Negative' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {sentiment.percentage}%
                    </div>
                    <div className="text-sm font-medium">{sentiment.type}</div>
                    <div className="text-xs text-muted-foreground">{sentiment.count} comments</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-center">
                Total comments analyzed: {totalComments}
              </div>
            </CardContent>
          </Card>

          {/* Risk Analysis Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis Dashboard</CardTitle>
              <small><i>The Risk Score is a "concern meter" for leaders. <b>Higher score = more problems</b>.</i></small>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Global HR Risk Score</span>
                  <span className="text-2xl font-bold text-red-600">{globalRiskScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${globalRiskScore > 70 ? 'bg-red-500' :
                      globalRiskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    style={{ width: `${globalRiskScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{riskBuckets.low}</div>
                  <div className="text-sm font-medium">Low Risk</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{riskBuckets.medium}</div>
                  <div className="text-sm font-medium">Medium Risk</div>
                </div>
                <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{riskBuckets.high}</div>
                  <div className="text-sm font-medium">High Risk</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium">Leader</th>
                      <th className="text-left py-3 font-medium">SD Count</th>
                      <th className="text-left py-3 font-medium">SA Count</th>
                      <th className="text-left py-3 font-medium">Risk Score</th>
                      <th className="text-left py-3 font-medium">Action Needed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {highRiskLeaders.map((leader, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="py-3 font-medium">{leader.name}</td>
                        <td className="py-3 text-red-600 font-bold">{leader.sdCount}</td>
                        <td className="py-3 text-green-600 font-bold">{leader.saCount}</td>
                        <td className="py-3 font-bold">{leader.riskScore}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            leader.actionNeeded === 'High' ? 'bg-red-100 text-red-800' :
                            leader.actionNeeded === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                          }`}>
                            {leader.actionNeeded}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BulkUploadAnalytics;