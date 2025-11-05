const fetch = require('node-fetch');

async function createTestJob() {
  // Using the existing uploaded PDFs from N&S Tractor
  const jobData = {
    spd_url: "https://s3.us-west-1.wasabisys.com/xl-benefits/pdf-uploads/1762378844082-N&S Tractor Co., Inc. 117299 01-01-20 PD-SPD.pdf",
    spd_filename: "pdf-uploads/1762378844082-N&S Tractor Co., Inc. 117299 01-01-20 PD-SPD.pdf",
    handbook_url: "https://s3.us-west-1.wasabisys.com/xl-benefits/pdf-uploads/1762378845990-CA Handbook.pdf",
    handbook_filename: "pdf-uploads/1762378845990-CA Handbook.pdf",
    focus_areas: [
      "Medical Benefits",
      "Short-Term Disability",
      "Long-Term Disability",
      "Life Insurance",
      "Dental Benefits",
      "Vision Benefits",
      "FMLA",
      "Bereavement Leave"
    ],
    client_name: "N&S Tractor (V2 Test)",
    client_logo_url: "https://s3.us-west-1.wasabisys.com/xl-benefits/pdf-uploads/1762378847005-xl-logo-icon.png",
    review_date: new Date().toISOString().split('T')[0],
    broker_profile_id: "396aa496-6686-47b0-a7f3-e0efe4b27ff3",
    branding: {
      logo_url: "https://s3.us-west-1.wasabisys.com/xl-benefits/pdf-uploads/1762378847005-xl-logo-icon.png",
      broker_name: "XL Benefits",
      primary_color: "#0066cc",
      secondary_color: "#003d7a"
    },
    email_recipients: ["sam@edw4rds.com"],
    user_id: "a5b39e6f-3b2b-4d83-8b43-ad1bf2a3c369",
    user_email: "sedwards@xlbenefits.com"
  };

  try {
    console.log('Creating new conflict analysis job for V2 testing...');

    const response = await fetch('https://xlb.vercel.app/api/employee/create-conflict-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData)
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Job created successfully!');
      console.log('Job ID:', result.job.id);
      console.log('Client:', result.job.client_name);
      console.log('Status:', result.job.status);
      console.log('\nThe V2 cron job will pick this up within the next minute.');
      console.log('Monitor progress at: https://xlb.vercel.app/api/employee/check-v2-jobs');
    } else {
      console.error('❌ Failed to create job:', result.error);
    }
  } catch (error) {
    console.error('❌ Error creating job:', error.message);
  }
}

createTestJob();