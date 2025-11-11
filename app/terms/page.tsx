import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-600 mb-8">Last updated: November 2025</p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Authorization and Copyright</h2>
            <p className="mb-4">
              XL Benefits, Corp. (XL Benefits) authorizes you to view, copy, and print documents published by XL Benefits on the World Wide Web for non-commercial use within your organization only. In consideration of this authorization, you agree that any copy of these documents shall retain all copyright and proprietary notices contained herein.
            </p>
            <p className="mb-4">
              Each document published by XL Benefits may contain other copyright information and proprietary notification relating to that individual document. Nothing contained herein shall be construed as conferring by estoppel, implication or otherwise any license or right under any trademark of XL Benefits or any third party. Nothing contained herein shall be construed as conferring any license or right under any XL Benefits copyright. The content herein shall not be copied or posted in any network computer or broadcast in any media. Any copy you make must include this copyright notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Warranty Disclaimer</h2>
            <p className="mb-4">
              XL Benefits makes no representations about the suitability of the content of this site for any purpose. This information is provided "as is" without warranty of any kind, either expressed or implied, including, but not limited to, the implied warranties of merchantability, title, non-infringement and fitness for a particular purpose, or non-infringement.
            </p>
            <p className="mb-4">
              XL Benefits will not be liable to anyone with respect to any damages, loss or claim whatsoever, no matter how occasioned, in connection with access to or use of the contents of this site. In no event shall XL Benefits be liable for any special, indirect, exemplary or consequential damages or any damages whatsoever, including but not limited to loss of use, data or profits, without regard to the form of any action including but not limited to contract or negligence or other tortious actions, arising out of or in connection with the use, copying or display of the content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Accuracy and Updates</h2>
            <p className="mb-4">
              XL Benefits has taken care to ensure that the information which follows is complete, accurate and up-to-date. However, XL Benefits assumes no responsibility for errors or omissions which may occur. All the information provided is subject to change from time to time at the sole discretion of XL Benefits.
            </p>
            <p className="mb-4">
              All publications may include technical inaccuracies or typographical errors. We reserve the right to make periodic changes, additions, and deletions to these publications, and the products and programs described in these publications without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Submissions and Feedback</h2>
            <p className="mb-4">
              All questions, comments, suggestions or the like regarding the content of any XL Benefits document shall be deemed to be non-confidential and XL Benefits shall have no obligation of any kind with respect to such information, and shall be free to reproduce, use, disclose, and distribute the information to others without limitation. Furthermore, XL Benefits shall be free to use any ideas, concepts, techniques, or know-how contained in such information for any purpose, including but not limited to development and marketing products and services which incorporate said information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Links to Other Sites</h2>
            <p className="mb-4">
              Some of the sites listed as links herein are not under the control of XL Benefits. Accordingly, XL Benefits makes no representations whatsoever concerning the content of those sites. The fact that XL Benefits has provided a link to a site is not an endorsement, authorization, sponsorship or affiliation by XL Benefits with respect to such site, its owners or its providers.
            </p>
            <p className="mb-4">
              XL Benefits is providing these links only as a convenience to you. XL Benefits has not tested any information, software or products found on these sites and therefore cannot make any representations whatsoever with respect thereto. There are risks in using any information, software or products found on the Internet, and XL Benefits cautions you to make sure that you completely understand these risks before retrieving, using, relying upon or purchasing anything via the Internet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">SMS Terms of Service</h2>
            <p className="text-sm text-gray-600 mb-4">(In reference to our SMS engagement with candidates through our recruiting and employment outreach.)</p>
            <p className="text-sm text-gray-600 mb-6">Updated: 12/14/2023</p>

            <ul className="list-disc pl-6 space-y-3">
              <li>
                When you opt-in to the service, we may send you SMS messages to notify you of any updates to your application status and to engage in discussion throughout your application process.
              </li>
              <li>
                You can cancel the SMS service at any time. Just text "STOP" to unsubscribe. After you send the SMS message "STOP" to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to opt-in again, just reply START to the phone number you unsubscribed to and we will start sending SMS messages to you again.
              </li>
              <li>
                If you are experiencing issues with the messaging program you can reply with the keyword "HELP" for more assistance, or you can get help directly at{' '}
                <a href="mailto:info@xlbenefits.com" className="text-xl-bright-blue hover:underline">
                  info@xlbenefits.com
                </a>{' '}
                or (386) 999-0001.
              </li>
              <li>
                Carriers are not liable for delayed or undelivered messages.
              </li>
              <li>
                As always, message and data rates may apply for any messages sent to you from us and to us from you. Message frequency may vary. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.
              </li>
              <li>
                If you have any questions regarding privacy, please read our{' '}
                <Link href="/privacy-policy" className="text-xl-bright-blue hover:underline">
                  xlbenefits.com/privacy-policy
                </Link>
                .
              </li>
            </ul>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tool Usage Disclaimer</h2>
            <p className="mb-4">
              Our interactive tools are provided for informational purposes only. Results are estimates and should not be considered professional advice. Always consult with qualified professionals for specific situations.
            </p>
            <p className="mb-4">
              While we strive for accuracy, stop-loss calculations can vary based on carrier-specific provisions, state regulations, and individual circumstances. Tool results are starting points for discussion, not final recommendations.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
