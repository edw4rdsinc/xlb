import { NextRequest, NextResponse } from 'next/server';
import { calculateFIERates } from '@/lib/fie-calculator/calculations';
import type { PlanData, CostComponents, TierRatios } from '@/lib/fie-calculator/calculations';

interface CalculateRequest {
  plans: PlanData[];
  costs: CostComponents;
  tierRatios: TierRatios;
  contactInfo: {
    name: string;
    email: string;
    company: string;
    phone?: string;
  };
  groupName: string;
  effectiveDate: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: CalculateRequest = await request.json();

    // Validate required fields
    if (!data.contactInfo?.email || !data.contactInfo?.name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactInfo.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate plans data
    if (!data.plans || data.plans.length === 0) {
      return NextResponse.json(
        { error: 'At least one plan is required' },
        { status: 400 }
      );
    }

    // Perform calculations server-side (hidden from client)
    const results = calculateFIERates(
      data.plans,
      data.costs,
      data.tierRatios
    );

    // TODO: Save lead to database/CRM
    // await saveToDatabase({
    //   email: data.contactInfo.email,
    //   name: data.contactInfo.name,
    //   company: data.contactInfo.company,
    //   groupName: data.groupName,
    //   results: results
    // });

    // Return results
    return NextResponse.json({
      success: true,
      results,
      message: 'Calculation completed successfully'
    });

  } catch (error) {
    console.error('FIE Calculation Error:', error);
    return NextResponse.json(
      { error: 'Failed to process calculation' },
      { status: 500 }
    );
  }
}