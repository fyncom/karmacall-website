import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/legal.css"
import Seo from "../components/seo"
import { Link } from "gatsby"

const TermsOfService = () => {
  return (
    <div>
      <Seo title="Terms of Service" description="KarmaCall's Terms of Service are listed here." />
      <Header />

      <div className="AppText">
        <div className="legal-container">
          <h1>End User License Agreement for KarmaCall</h1>
          <p>
            <strong>
              <br />
              Last updated November 25, 2023
            </strong>
            <br />
            <br />
            KarmaCall is licensed to You (End-User) by RoboCash, Inc., Doing Business As FynCom, located at 1401 21st ST #6658, Sacramento, CA 95811, United
            States (hereinafter: Licensor), for use only under the terms of this License Agreement.
            <br />
            <br />
            By downloading the Application from the Google Play Store or Apple App Store, and any update thereto (as permitted by this License Agreement), You
            indicate that You agree to be bound by all of the terms and conditions of this License Agreement, and that You accept this License Agreement.
            <br />
            <br />
            The parties of this License Agreement acknowledge that Google and Apple are not Parties to this License Agreement and is not bound by any provisions
            or obligations with regard to the Application, such as warranty, liability, maintenance and support thereof. FynCom, not Google or Apple, is solely
            responsible for the licensed Application and the content thereof.
            <br />
            <br />
            This License Agreement may not provide for usage rules for the Application that are in conflict with the latest Google Play Store or Apple App Store
            Terms of Service. FynCom acknowledges that it had the opportunity to review said terms and this License Agreement is not conflicting with them.
            <br />
            <br />
            All rights not expressly granted to You are reserved.
            <br />
            <br />
            <br />
            <div className="legal-text-container-table">
              <strong>TABLE OF CONTENTS</strong>
              <ol>
                <li>
                  <a href="#section-1">THE APPLICATION</a>
                </li>
                <li>
                  <a href="#section-2">SCOPE OF LICENSE</a>
                </li>
                <li>
                  <a href="#section-3">TECHNICAL REQUIREMENTS</a>
                </li>
                <li>
                  <a href="#section-4">MAINTENANCE AND SUPPORT</a>
                </li>
                <li>
                  <a href="#section-5">USE OF DATA</a>
                </li>
                <li>
                  <a href="#section-6">
                    <b>LIABILITY</b>
                  </a>
                </li>
                <li>
                  <a href="#section-7">WARRANTY</a>
                </li>
                <li>
                  <a href="#section-8">PRODUCT CLAIMS</a>
                </li>
                <li>
                  <a href="#section-9">LEGAL COMPLIANCE</a>
                </li>
                <li>
                  <a href="#section-10">CONTACT INFORMATION</a>
                </li>
                <li>
                  <a href="#section-11">TERMINATION</a>
                </li>
                <li>
                  <a href="#section-13">THIRD-PARTY TERMS OF AGREEMENTS AND BENEFICIARY</a>
                </li>
                <li>
                  <a href="#section-13">INTELLECTUAL PROPERTY RIGHTS</a>
                </li>
                <li>
                  <a href="#section-14">APPLICABLE LAW</a>
                </li>
                <li>
                  <a href="#section-15">MISCELLANEOUS</a>
                </li>
              </ol>
            </div>
            <div className="legal-text-container">
              <ol start="1" id="section-1">
                <li>
                  <strong> THE APPLICATION</strong>
                </li>
              </ol>
              KarmaCall (hereinafter: Application) is a piece of software created to block malicious spam calls through a financial filter that pays users to
              ignore unknown calls. This is customized for Google and Apple mobile devices. It is used to block spam calls while allowing unknown callers to
              make refundable micro-deposits in order to authenticate themselves to you.
              <br />
              <br />
              Furthermore, it is used to Earn and withdraw <a href="https://nano.org/">Nano cryptocurrency</a> while allowing the option to cash out to gift
              cards.
              <br />
              <br />
              While the Application follows general privacy policy standards (see our <Link to="/privacy-policy">Privacy Policy</Link>), the Application is not
              tailored to comply with industry-specific regulations (Health Insurance Portability and Accountability Act (HIPAA), Federal Information Security
              Management Act (FISMA), etc.), so if your interactions would be subjected to such laws, you may not use this Application. You may not use the
              Application in a way that would violate the Gramm-Leach-Bliley Act (GLBA).
            </div>
            <div className="legal-text-container">
              <ol start="2" id="section-2">
                <li>
                  <strong> SCOPE OF LICENSE</strong>
                </li>
              </ol>
              2.1 You are given a non-transferable, non-exclusive, non-sublicensable license to install and use the Licensed Application on any Google-branded
              or Apple-branded Products that You (End-User) own or control and as permitted by the Usage Rules set forth in this section and the Google Play
              Store or Apple App Store Terms of Service, with the exception that such licensed Application may be accessed and used by other accounts associated
              with You (End-User, The Purchaser) via Family Sharing or volume purchasing.
              <br />
              <br />
              2.2 This license will also govern any updates of the Application provided by Licensor that replace, repair, and/or supplement the first
              Application, unless a separate license is provided for such update in which case the terms of that new license will govern.
              <br />
              <br />
              2.3 You may not share or make the Application available to third parties (unless to the degree allowed by the Google or Apple Terms and
              Conditions, and with FynCom's prior written consent), sell, rent, lend, lease or otherwise redistribute the Application.
              <br />
              <br />
              2.4 You may not reverse engineer, translate, disassemble, integrate, decompile, integrate, remove, modify, combine, create derivative works or
              updates of, adapt, or attempt to derive the source code of the Application, or any part thereof (except with FynCom's prior written consent).
              <br />
              <br />
              2.5 You may not copy (excluding when expressly authorized by this license and the Usage Rules) or alter the Application or portions thereof. You
              may create and store copies only on devices that You own or control for backup keeping under the terms of this license, the Google Play Store
              Terms of Service, the Apple App Store Terms of Service and any other terms and conditions that apply to the device or software used. You may not
              remove any intellectual property notices. You acknowledge that no unauthorized third parties may gain access to these copies at any time.
              <br />
              <br />
              2.6 Violations of the obligations mentioned above, as well as the attempt of such infringement, may be subject to prosecution and damages.
              <br />
              <br />
              2.7 Licensor reserves the right to modify the terms and conditions of licensing.
              <br />
              <br />
              2.8 Nothing in this license should be interpreted to restrict third-party terms. When using the Application, You must ensure that You comply with
              applicable third-party terms and conditions.
            </div>
            <div className="legal-text-container">
              <ol start="3" id="section-3">
                <li>
                  <strong>TECHNICAL REQUIREMENTS</strong>
                </li>
              </ol>
              3.1 The Application requires a firmware version of Android 7.0 or higher.
              <br />
              <br />
              3.2 Licensor attempts to keep the Application updated so that it complies with modified/new versions of the firmware and new hardware. You are not
              granted rights to claim such an update.
              <br />
              <br />
              3.3 You acknowledge that it is Your responsibility to confirm and determine that the app end-user device on which You intend to use the
              Application satisfies the technical specifications mentioned above.
              <br />
              <br />
              3.4 Licensor reserves the right to modify the technical specifications as it sees appropriate at any time.
            </div>
            <div className="legal-text-container">
              <ol start="4" id="section-4">
                <li>
                  <strong>MAINTENANCE AND SUPPORT</strong>
                </li>
              </ol>
              4.1 The Licensor is solely responsible for providing any maintenance and support services for this licensed Application. You can reach the
              Licensor at the email address listed in the Google Play Store Overview or Apple App Store Overview for this licensed Application.
              <br />
              <br />
              4.2 FynCom and the End-User acknowledge that Google or Apple has no obligation whatsoever to furnish any maintenance and support services with
              respect to the licensed Application.
            </div>
            <div className="legal-text-container">
              <ol start="5" id="section-5">
                <li>
                  <strong>USE OF DATA</strong>
                </li>
              </ol>
              You acknowledge that Licensor will be able to access and adjust Your downloaded licensed Application content and Your personal information, and
              that Licensor's use of such material and information is subject to Your legal agreements with Licensor and Licensor's privacy policy.
            </div>
            <div className="legal-text-container">
              <ol start="6" id="section-6">
                <li>
                  <strong>LIABILITY</strong>
                </li>
              </ol>
              6.1 Licensor's responsibility in the case of violation of obligations and tort shall be limited to intent and gross negligence. Only in case of a
              breach of essential contractual duties (cardinal obligations), Licensor shall also be liable in case of slight negligence. In any case, liability
              shall be limited to the foreseeable, contractually typical damages. The limitation mentioned above does not apply to injuries to life, limb, or
              health.
              <br />
              <br />
              6.2 Licensor takes no accountability or responsibility for any damages caused due to a breach of duties according to Section 2 of this Agreement.
              To avoid data loss, You are required to make use of backup functions of the Application to the extent allowed by applicable third-party terms and
              conditions of use. You are aware that in case of alterations or manipulations of the Application, You will not have access to licensed
              Application.
            </div>
            <div className="legal-text-container">
              <ol start="7" id="section-7">
                <li>
                  <strong>WARRANTY</strong>
                </li>
              </ol>
              7.1 Licensor warrants that the Application is free of spyware, trojan horses, viruses, or any other malware at the time of Your download. Licensor
              warrants that the Application works as described in the user documentation.
              <br />
              <br />
              7.2 No warranty is provided for the Application that is not executable on the device, that has been unauthorizedly modified, handled
              inappropriately or culpably, combined or installed with inappropriate hardware or software, used with inappropriate accessories, regardless if by
              Yourself or by third parties, or if there are any other reasons outside of FynCom's sphere of influence that affect the executability of the
              Application.
              <br />
              <br />
              7.3 You are required to inspect the Application immediately after installing it and notify KarmaCall Inc. about issues discovered without delay by
              e-mail provided in Product Claims. The defect report will be taken into consideration and further investigated if it has been mailed within a
              period of ninety (90) days after discovery.
              <br />
              <br />
              7.4 If we confirm that the Application is defective, FynCom reserves a choice to remedy the situation either by means of solving the defect or
              substitute delivery.
              <br />
              <br />
              7.5 In the event of any failure of the Application to conform to any applicable warranty, You may notify the App-Store-Operator, and Your
              Application purchase price will be refunded to You. To the maximum extent permitted by applicable law, the App-Store-Operator will have no other
              warranty obligation whatsoever with respect to the App, and any other losses, claims, damages, liabilities, expenses and costs attributable to any
              negligence to adhere to any warranty.
              <br />
              <br />
              7.6 If the user is an entrepreneur, any claim based on faults expires after a statutory period of limitation amounting to twelve (12) months after
              the Application was made available to the user. The statutory periods of limitation given by law apply for users who are consumers.
            </div>
            <div className="legal-text-container">
              <ol start="8" id="section-8">
                <li>
                  <strong>PRODUCT CLAIMS</strong>
                </li>
              </ol>
              FynCom and the End-User acknowledge that FynCom, and not Google or Apple, is responsible for addressing any claims of the End-User or any third
              party relating to the licensed Application or the End-User’s possession and/or use of that licensed Application, including, but not limited to:
              <br />
              <br />
              (i) product liability claims;
              <br />
              <br />
              (ii) any claim that the licensed Application fails to conform to any applicable legal or regulatory requirement; and
              <br />
              <br />
              (iii) claims arising under consumer protection, privacy, or similar legislation, including in connection with Your Licensed Application’s use of
              the HealthKit and HomeKit.
            </div>
            <div className="legal-text-container">
              <ol start="9" id="section-9">
                <li>
                  <strong>LEGAL COMPLIANCE</strong>
                </li>
              </ol>
              You represent and warrant that You are not located in a country that is subject to a U.S. Government embargo, or that has been designated by the
              U.S. Government as a "terrorist supporting" country; and that You are not listed on any U.S. Government list of prohibited or restricted parties.
            </div>
            <div className="legal-text-container">
              <ol start="10" id="section-10">
                <li>
                  <strong>CONTACT INFORMATION</strong>
                </li>
              </ol>
              For general inquiries, complaints, questions or claims concerning the licensed Application, please contact:
              <br />
              <br />
              FynCom 17877 Von Karman Ave, Suite 400 Irvine, CA 92614 United States support@karmacall.com
            </div>
            <div className="legal-text-container">
              <ol start="11" id="section-11">
                <li>
                  <strong>TERMINATION</strong>
                </li>
              </ol>
              The license is valid until terminated by FynCom or by You. Your rights under this license will terminate automatically and without notice from
              FynCom if You fail to adhere to any term(s) of this license. Upon License termination, You shall stop all use of the Application, and destroy all
              copies, full or partial, of the Application.
            </div>
            <div className="legal-text-container">
              <ol start="12" id="section-12">
                <li>
                  <strong>THIRD-PARTY TERMS OF AGREEMENTS AND BENEFICIARY</strong>
                </li>
              </ol>
              FynCom represents and warrants that FynCom will comply with applicable third-party terms of agreement when using licensed Application.
              <br />
              <br />
              In Accordance with Section 9 of the "Instructions for Minimum Terms of Developer's End-User License Agreement," Google and Google's subsidiaries,
              OR, Apple and Apple's subsidiaries (depending in which device you use) shall be third-party beneficiaries of this End User License Agreement and -
              upon Your acceptance of the terms and conditions of this license agreement, Either Google or Apple will have the right (and will be deemed to have
              accepted the right) to enforce this End User License Agreement against You as a third-party beneficiary thereof.
            </div>
            <div className="legal-text-container">
              <ol start="13" id="section-13">
                <li>
                  <strong>INTELLECTUAL PROPERTY RIGHTS</strong>
                </li>
              </ol>
              FynCom and the End-User acknowledge that, in the event of any third-party claim that the licensed Application or the End-User's possession and use
              of that licensed Application infringes on the third party's intellectual property rights, FynCom, and not Google or Apple, will be solely
              responsible for the investigation, defense, settlement and discharge or any such intellectual property infringement claims.
            </div>
            <div className="legal-text-container">
              <ol start="14" id="section-14">
                <li>
                  <strong>APPLICABLE LAW</strong>
                </li>
              </ol>
              This license agreement is governed by the laws of the State of California excluding its conflicts of law rules.
            </div>
            <div className="legal-text-container">
              <ol start="15" id="section-15">
                <li>
                  <strong>MISCELLANEOUS</strong>
                </li>
              </ol>
              15.1 If any of the terms of this agreement should be or become invalid, the validity of the remaining provisions shall not be affected. Invalid
              terms will be replaced by valid ones formulated in a way that will achieve the primary purpose.
              <br />
              <br />
              15.2 Collateral agreements, changes and amendments are only valid if laid down in writing. The preceding clause can only be waived in writing.
              <br />
            </div>
          </p>{" "}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TermsOfService
