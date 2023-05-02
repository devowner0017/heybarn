import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './TermsOfService.module.css';

const TermsOfService = props => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.serviceContent}>
        <p id={css.first}>
          BY ACCEPTING THESE TERMS OF SERVICE, YOU AGREE TO BE BOUND BY ALL OF THE PROVISIONS BELOW.
          PLEASE READ THEM CAREFULLY. YOU USE THE HEYBARN SITE AT YOUR SOLE RISK.
        </p>
        <p>
          <strong>Introduction/key terms</strong>
        </p>
        <p>
          Heybarn (hereinafter referred to as “Heybarn”, “we”, “us”, or “our”) operates an online
          Platform that connects Space Owners to Renters through our website (“Platform”). Heybarn
          refers to Heybarn Limited (a New Zealand Registered Business).
        </p>
        <p>
          Please note that these Terms and Conditions may be amended from time to time. Notification
          of any changes will be made by posting new terms on the Site and, in continuing to use the
          Site, you confirm that you accept the current terms and conditions in full at the time you
          use the Site. If you object to any changes to the Conditions, your only remedy is to
          immediately discontinue your use of the Site.
        </p>
        <ul>
          <li>
            <p>
              The terms “<strong>Service</strong>” or “<strong>Services</strong>” refer to any
              services we offer, including all Heybarn web applications, and other software,
              helpdesk services, beta versions, and the web site accessible at www.heybarn.co.nz and
              its associated content(collectively, the “<strong>Site</strong>”) as well as any and
              all marketing channels where Collective Content may be disseminated at Heybarn’s sole
              discretion.
            </p>
          </li>
          <li>
            <p>The terms “you” or “your” refer to anyone who views or uses the Site or Services.</p>
          </li>
          <li>
            <p>
              The terms “<strong>Space Owner</strong>” refers to the person engaged in the provision
              of Space for the Renters in accordance with these Terms.
            </p>
          </li>
          <li>
            <p>
              The terms “<strong>Renter</strong>” or “<strong>Renting</strong>” refer to the person
              or persons engaging in a temporary lease of the Space Owner’s Space, and the act of
              engaging in a temporary lease of the Space Owner’s Space, respectively.
            </p>
          </li>
          <li>
            <p>
              The term “<strong>Space</strong>” refers to the area of the Space Owner’s property
              rented or offered for rent by a Space Owner.
            </p>
          </li>
          <li>
            <p>
              The term “<strong>Listing</strong>” refers to the searchable description listing the
              Space Owner’s space as found on this Site or the Services.
            </p>
          </li>
          <li>
            <p>
              The term “<strong>Renter Request</strong>” refers to the searchable description
              outlining the Renter’s need for space as found on this Site or the Services.
            </p>
          </li>
          <li>
            <p>
              The term “<strong>Connection Fee</strong>” refers to a payment made to Heybarn in
              exchange for providing the contact details of a Renter or Space Owner, with their
              permission, to an interested party via the Site.
            </p>
          </li>
          <li>
            <p>
              The term “<strong>Stored Items</strong>” refer to the property or goods of the Renter
              that are stored in the Space Owner’s Space.
            </p>
          </li>
          <li>
            <p>
              The term <strong>“Business Activities”</strong> refers to any activities undertaken by
              the Renter in the Space Owner’s Space.
            </p>
          </li>
          <li>
            <p>
              The term <strong>“Event”</strong> refers to a single occasion or activity undertaken
              by the Renter in the Space Owner’s Space.
            </p>
          </li>
          <li>
            <p>
              The term “<strong>Booking</strong>” refers to a confirmed transaction between Space
              Owner and Renter whereby Renter stores its Property in a Space Owner’s Space or uses
              the Space Owner’s Space for Business Activities or an Event.
            </p>
          </li>
          <li>
            <p>
              “<strong>Member</strong>” means a person who completes Heybarn’s profile registration
              process as described under “Profile Registration” below.
            </p>
          </li>
          <li>
            <p>
              “<strong>Heybarn Content</strong>” means all Content that Heybarn makes available
              through the Site including any Content licensed from a third party but excluding
              Member Content.
            </p>
          </li>
          <li>
            <p>
              “<strong>Member Content</strong>” means all Content that a Member posts, uploads,
              publishes, submits or transmits to be made available through the Site. Member Content
              may include user profiles and biographical information.
            </p>
          </li>
          <li>
            <p>
              “<strong>Collective Content</strong>” means Member Content and Heybarn Content.
            </p>
          </li>
          <li>
            <p>
              “<strong>Content</strong>” means text, graphics, images, software, audio, video,
              information or other materials.
            </p>
          </li>
        </ul>
        <p>
          <strong>Terms Relating to Service</strong>
        </p>
        <p>
          By using the Site or Services, you acknowledge and agree that by accessing or using the
          Site or Services, you comply with and will be legally bound by the terms and conditions of
          these Terms of Service (“Terms”), whether you are a member or an unregistered visitor. If
          you do not agree to these Terms, then you have no right to access or use the Site or
          Services, or Collective Content. Unauthorized or improper use of the Services or a
          violation of the Terms set forth herein may result in you being banned from the Site and
          any use of the Services or Site thereafter may subject you to civil liability and/or
          criminal penalties.
        </p>
        <p>
          Except where expressly stated otherwise, Content on the Site is provided as general
          information only. It is not intended as advice and must not be relied upon as such. You
          should make your own enquiries and take independent advice tailored to your specific
          circumstances prior to making any decisions.
        </p>
        <p>
          We have no control over the conduct of Space Owners, Renters or other users of the Site
          and Services, and disclaims any and all liability. We cannot and do not control the
          Content contained in any Listing or Renter Request nor the condition, legality or
          suitability of any Space and disclaim any related liability. You understand and agree that
          we are not a party to any agreements entered into between Space Owners and Renters, nor
          are we a real estate broker, an insurer or an owner or operator of properties. We do not
          sell, resell, furnish, provide, rent, re-rent, manage and/or control properties. Our
          responsibility is limited to facilitating the availability of the Site and Services.
        </p>
        <p>
          <br />
          You agree that you are solely responsible to become familiar with and abide by any law or
          other regulation that relates to the storage of contents or the undertaking of business
          activities or events (“applicable law”). We do not advise on issues related to applicable
          law.
        </p>
        <p>
          You may not use the Site to publish offensive, inaccurate, misleading, defamatory,
          fraudulent, or illegal information or Content. We reserve the right to, at any time and
          without notice, remove any Content from the Site and restrict your access to the Site at
          any time for any reason. You may not download (other than page caching) or modify the
          Site, or any portion of it, except with our express written consent. In the event that you
          are informed that you will no longer by entitled to access the Services or Site, you will
          not be entitled to register again, and you will no longer have permission to use the Site.
        </p>
        <p>
          You must take your own precautions to ensure your access to the Site and Services does not
          expose you to the risk of viruses, malicious computer code or other forms of interference
          which may damage your own computer system or other personal devices.
        </p>
        <p>
          <strong>Listing, linking and commercial use</strong>
        </p>
        <p>
          You are not entitled to solicit the custom of other users without our express written
          consent. You are not entitled to resell or commercially exploit the Site’s Contents other
          than the Member Content that you have posted. You are not allowed to list your contact
          details on a Renter Request or Listing. You are not entitled to use any data mining,
          robots, or similar data gathering and extraction tools to collect usernames, email
          addresses or any other data for the purposes of sending unsolicited email or for any other
          use. If we believe that you have breached one or more of these terms, we reserve the right
          to terminate your registration immediately and without notice without limiting any other
          rights and remedies we may have.
        </p>
        <p>
          The Site and Services may include links to Third Party websites or material which is
          beyond our control. We are not responsible for Content on any website outside of the Site
          and you acknowledge and agree that we are not responsible or liable for the availability
          or accuracy of such websites. Links to such websites do not imply any endorsement by
          Heybarn of such websites or resources or the Content or services available from such
          websites or resources.
        </p>
        <p>
          You may link to our home page, provided you do so in a way that is fair and legal and does
          not damage our reputation or take advantage of it, but you must not establish a link in
          such a way as to suggest any form of association, approval or endorsement on our part
          where none exists. You must not establish a link from any website that is not owned by
          you. Our Site may not be framed on any other website, nor may you create a link to any
          part of our Site other than the home page. We reserve the right to withdraw linking
          permission without notice.
        </p>
        <p>
          This Site or any portion of this Site may not be reproduced, duplicated, copied, sold,
          resold, visited, or otherwise exploited for any commercial purpose without our express
          written consent. You may not systematically extract and/or re-utilise parts of the Content
          of the Site without our express written consent. You may not utilise any data mining,
          robots, or similar data gathering and extraction tools to extract (whether once or many
          times) for re-utilisation of any substantial parts of this Site without our express
          consent.
        </p>
        <p>
          Some portions of the Site implement Google Maps/Earth mapping services, including Google
          Maps API(s). Your use of Google Maps/Earth is subject to Google’s terms of use, located
          at:
        </p>
        <p>
          <u>http://www.google.us/intl/en_us/help/terms_maps.html</u>.
        </p>
        <p>
          <br />
          <strong>Our liability</strong>
        </p>
        <p>
          The material on the Site is provided without any guarantees, conditions or warranties as
          to its accuracy and is provided on an “as is” basis. To the extent permitted by law, we
          hereby expressly exclude all conditions, warranties and other terms which might otherwise
          be implied by any law, regulation, statute, common law or law of equity. Your access to
          the Site may be occasionally restricted to allow for repairs, maintenance or the
          introduction of new facilities or Services. We will attempt to restore the Service as soon
          as we reasonably can, and such interruptions shall not constitute a breach by us of these
          terms.
        </p>
        <p>
          We will not be responsible for any breach of these Terms and Conditions caused by
          circumstances beyond our reasonable control. We make no promise that the Services on the
          Site will meet your requirements. We cannot guarantee that the Services will be without
          fault. We will not be liable for any business, financial, or economic loss nor for any
          consequential or indirect loss (such as lost reputation, lost profit or lost opportunity)
          arising as a result of your use of the Site whether such loss is incurred or suffered as a
          result of our negligence or otherwise.
        </p>
        <p>
          <strong>Your Liability</strong>
        </p>
        <p>
          In connection with your use of our Site and Services, you agree that you will not use our
          Site to:
        </p>
        <ul>
          <li>
            <p>
              violate any law or regulation, or any order of a court, including, without limitation,
              zoning restrictions and tax regulations
            </p>
          </li>
          <li>
            <p>
              copy, store or otherwise access any information contained on the Site, Services or
              Content for purposes not expressly permitted by these Terms
            </p>
          </li>
          <li>
            <p>
              infringe the rights of any person or entity, including without limitation, its
              intellectual property, privacy, publicity or contractual rights
            </p>
          </li>
          <li>
            <p>
              interfere with or damage our Site or Services, including, without limitation, through
              the use of cancel bots, Trojan horses, harmful code, flood pings, denial-of-service
              attacks, packet or IP spoofing, forged routing or electronic mail address information
              or similar methods or technology
            </p>
          </li>
          <li>
            <p>
              upload, post, transmit or otherwise make available any Content that includes an image
              or personal information of another person or persons unless you have their consent or
              poses or creates a privacy or security risk to any person.
            </p>
          </li>
          <li>
            <p>
              upload, post, transmit or otherwise make available any Content that contains viruses,
              or other computer codes, files or programs designed to interrupt, limit or destroy the
              functionality of other computer software or hardware
            </p>
          </li>
          <li>
            <p>
              upload, post, transmit or otherwise make available any Content that contains
              financial, legal, medical or other professional advice
            </p>
          </li>
          <li>
            <p>
              transmit, distribute, post or submit any information concerning any other person or
              entity, including without limitation, photographs of others without their permission,
              personal contact information or credit, debit, calling card or account numbers
            </p>
          </li>
          <li>
            <p>
              transmit (or authorise the transmission of) “junk mail”, “chain letters”, unsolicited
              emails, instant messaging, “spimming”, or “spamming”
            </p>
          </li>
          <li>
            <p>
              “stalk” or harass any other user of our Site, or Services or collect or store any
              personally identifiable information about any other user other than for purposes of
              transacting as a Renter or Space Owner
            </p>
          </li>
          <li>
            <p>
              offer, as a Space Owner, any Space that you do not yourself own or have permission to
              rent (without limiting the foregoing, you will not list Space as a Space Owner if you
              are serving in the capacity of a rental agent or listing agent for a third party)
            </p>
          </li>
          <li>
            <p>
              contact a Space Owner or Renter for any purpose other than asking a question related
              to a Booking
            </p>
          </li>
          <li>
            <p>
              impersonate any person or entity, or falsify or otherwise misrepresent yourself or
              your affiliation with any person or entity
            </p>
          </li>
          <li>
            <p>
              find a Space Owner or Renter independent of the Site or Services in order to
              circumvent the obligation to pay the Connection Fee related to our provision of the
              Services
            </p>
          </li>
          <li>
            <p>
              as a Space Owner, submit any Listing with a false or misleading price information, or
              submit any Listing with a price that you do not intend to honour
            </p>
          </li>
          <li>
            <p>
              post, upload, publish, submit or transmit any Content that: (i) infringes,
              misappropriates or violates a Third Party’s patent, copyright, trademark, trade
              secret, moral rights or other intellectual property rights, or rights of publicity or
              privacy; (ii) violates, or encourages any conduct that would violate, any applicable
              law or regulation or would give rise to civil liability; (iii) is fraudulent, false,
              misleading or deceptive; (iv) is defamatory, obscene, pornographic, vulgar or
              offensive; (v) promotes discrimination, bigotry, racism, hatred, harassment or harm
              against any individual or group; (vi) is violent or threatening or promotes violence
              or actions that are threatening to any other person; or (vii) promotes illegal or
              harmful activities or substances
            </p>
          </li>
          <li>
            <p>
              use, display, mirror or frame the Site, or any individual element within the Site or
              Services, Heybarn’s name, logo or other proprietary information, or the layout and
              design of any page or form contained on a page, without our express written consent
            </p>
          </li>
          <li>
            <p>
              access, tamper with, or use non-public areas of the Site, Heybarn’s computer systems,
              or the technical delivery systems of our providers
            </p>
          </li>
          <li>
            <p>
              attempt to probe, scan, or test the vulnerability of any Heybarn system or network or
              breach any security or authentication measures
            </p>
          </li>
          <li>
            <p>
              avoid, bypass, remove, deactivate, impair, descramble, or otherwise circumvent any
              technological measure implemented by Heybarn or any of Heybarn’s providers or any
              other third party (including another user) to protect the Site, Services or Collective
              Content
            </p>
          </li>
          <li>
            <p>
              forge any TCP/IP packet header or any part of the header information in any email or
              newsgroup posting, or in any way use the Site, App, Services or Collective Content to
              send altered, deceptive or false source-identifying information
            </p>
          </li>
          <li>
            <p>
              attempt to decipher, decompile, disassemble or reverse engineer any of the software
              used to provide the Site, Services or Collective Content; or advocate, encourage, or
              assist any third party in doing any of the foregoing.
            </p>
          </li>
        </ul>
        <p>
          <strong>Reporting Misconduct</strong>
        </p>
        <p>
          If you rent Space to anyone who you feel is acting or has acted inappropriately, including
          but not limited to, anyone who:
        </p>
        <ul>
          <li>
            <p>engages in offensive, violent or sexually inappropriate behaviour,</p>
          </li>
          <li>
            <p>you suspect of stealing from you, or</p>
          </li>
          <li>
            <p>engages in any other disturbing conduct,</p>
          </li>
        </ul>
        <p>
          you should immediately report such person to the appropriate authorities and to us by
          contacting Heybarn with your police report number at enquiries@heybarn.co.nz; provided
          that your report will not obligate us to take any action beyond that required by law (if
          any) or cause us to incur any liability to you.
        </p>
        <p>
          <strong>Termination and Account Cancellation</strong>
        </p>
        <p>
          We may, in our discretion and without liability to you, with or without cause, with or
          without prior notice and at any time: (a) terminate these Terms or your access to our Site
          and Services, and (b) deactivate or cancel your Heybarn Profile. Upon termination we will
          promptly pay you any amounts we reasonably determine we owe you at our discretion, which
          we are legally obligated to pay you. In the event we terminate these Terms, or your access
          to our Site and Services or deactivate or cancel your Heybarn Profile, you will remain
          liable for all amounts due hereunder. You may cancel your Heybarn Profile at any time by
          sending an email to enquiries@heybarn.co.nz. Please note that if your Heybarn Profile is
          cancelled, we do not have an obligation to delete or return to you any Content you have
          posted to the Site and Services, including, but not limited to, any reviews or Feedback
          you have provided to Heybarn.
        </p>
        <p>
          <strong>Eligibility and communication</strong>
        </p>
        <p>
          You agree to be bound by the terms of our Privacy Policy which explains the use we are
          authorised to make of your personal information. The Site is intended solely for persons
          who are 18 years of age or older. Any access to or use of the Site or Services by anyone
          under 18 years of age is expressly prohibited. By accessing or using the Site or Services
          you represent and warrant that you are 18 years of age or older.
        </p>
        <p>
          All communication with you will be via the email address provided to us (as updated by
          you). By accepting these terms, you give your consent to receive communications from us by
          email and you agree that all agreements, notices, disclosures and other communications
          that we provide to you via email satisfy any legal requirements that such communication be
          in writing. Personal information that you supply to us will not be disclosed by us to any
          third party external to the Site save in accordance with our Privacy Policy.
        </p>
        <p>
          With your permission, your contact information will be forwarded to an individual Heybarn
          Member for the purpose of communicating with that Member to arrange a viewing of a
          Listing. All resultant communications are the responsibility of yourself and the other
          Member.
        </p>
        <p>
          To contact another Member on heybarn, a payment of a non-refundable Connection fee is
          required. If that Member does not reply to that attempted contact within five (5)
          business/working days (including public holidays), the heybarn Connection Guarantee can be
          applied to contact another Member at no charge. This Connection Guarantee must be applied
          within thirty (30) calendar days. This time limit re-starts each time contact is not
          received within the five day working day period. If multiple Members are contacted within
          a five-day period, a Connection fee must be paid for each individual contact.
        </p>
        <p>
          Payment of one Connection fee will invoke the Connection Guarantee rule for attempted
          contact with only one other Member within each five-day period, with "contact" defined as
          a reply to the communication message from heybarn. This reply may be that the Member did
          not want to communicate further. The contact does not have to be positive or an agreement
          to proceed further.
        </p>
        <p>
          You are not entitled to allow any other person to use your registration. You may not have
          more than one registration on the Site. You may not impersonate any other person in a
          registration whether or not that other person is a user of the Site. We may, at any time,
          request a form of identification to verify your identity. If we believe that you have
          breached one or more of these terms, we reserve the right to terminate the registration
          immediately and without notice.
        </p>
        <p>
          <strong>Profiles</strong>
        </p>
        <p>Profile Registration</p>
        <p>
          You may view Listings and Renter Requests as an unregistered visitor to the Site; however,
          if you wish to create a Listing or Renter Request, you must first create a Heybarn
          Profile. Registration on the Site is currently free of charge and requires the provision
          of some basic personal information. You agree that all information supplied on
          registration is true and accurate and will be kept up to date at all times. This
          information will be used to contact you, as necessary.
        </p>
        <p>
          As part of the functionality of the Site and Services, you may link your Heybarn Account
          with Third Party Accounts, by either: (i) providing your Third Party Account login
          information to Heybarn through the Site or Services; or (ii) allowing us to access your
          Third Party Account, as is permitted under the applicable terms and conditions that govern
          your use of each Third Party Account. You represent that you are entitled to disclose your
          Third Party Account login information to us and/or grant us access to your Third Party
          Account (including, but not limited to, for use for the purposes described herein),
          without breach by you of any of the terms and conditions that govern your use of the
          applicable Third Party Account and without obligating us to pay any fees or making us
          subject to any usage limitations imposed by such Third Party service providers. By
          granting us access to any Third Party Accounts, you understand that we will access, make
          available and store (if applicable) any Content that you have provided to and stored in
          your Third Party Account (“SNS Content”) so that it is available on and through the Site
          and Services via your Heybarn Profile and Heybarn Profile page.
        </p>
        <p>
          Unless otherwise specified in these Terms, all SNS Content, if any, will be considered to
          be Member Content for all purposes of these Terms. Depending on the Third Party Accounts
          you choose and subject to the privacy settings that you have set in such Third Party
          Accounts, personally identifiable information that you post to your Third Party Accounts
          will be available on and through your Heybarn Account on the Site and Services. Please
          note that if a Third Party Account or associated Service becomes unavailable or our access
          to such Third Party Account is terminated by the third party service provider, then SNS
          Content will no longer be available on and through the Site and Services. You have the
          ability to disable the connection between your Heybarn Profile and your Third Party
          Accounts, at any time, by accessing the “Settings” section of the Site.
        </p>
        <p>
          We will create your Heybarn Account and your Heybarn Account profile page for your use of
          the Site and Services based upon the personal information you provide to us or that we
          obtain via a Third Party Account as described above.
        </p>
        <p>
          You are responsible for safeguarding the security and confidentiality of your membership
          details, including your username and password. You are wholly responsible for all
          activities which occur under your membership details (including unauthorised use of your
          credit card details). You must notify us immediately if you become aware of any
          unauthorised use of your membership details by emailing&nbsp;
          <a href="mailto:enquiries@heybarn.co.nz">enquiries@heybarn.co.nz</a>. We’ll consider
          whether there are grounds for taking any action, but you won’t necessarily be contacted as
          to our decision.
        </p>
        <p>Connection fee</p>
        <p>
          Heybarn will charge a non-refundable Connection fee to inform a Space Owner or Renter that
          a Member is interested in their Renter Request or Listing. This fee is non-refundable
          under all circumstances. Any communication between Members, including but not limited to
          timing, content, format and/or frequency, is the responsibility of those Members.
        </p>
        <p>Renter Information</p>
        <p>
          It is the Space Owner’s sole responsibility to check the Renter’s background, credit
          history and/or criminal history and refuse to rent to the Renter upon receipt of such
          information.
        </p>
        <p>Change of Renter Information</p>
        <p>
          The Renter agrees to immediately notify the Space Owner of changes in the Renter’s email
          address, mailing address, phone number or other contact information. The Renter is
          strongly encouraged to keep the Space Owner informed of any anticipated changes that may
          affect the terms of use of the space.
        </p>
        <p>
          <strong>Listings</strong>
        </p>
        <p>
          As a Space Owner, you may create one or more Listings. To this end, you will be asked a
          variety of questions about the Space to be listed, including, but not limited to, the
          location, capacity, size, features, availability of the Space and pricing and related
          rules and financial terms. In order to be featured in Listings via the Site and/or
          Services, all Space must have a valid physical address. Listings will be made publicly
          available via the Site and Services. Other Members will be able to view your Listing on
          the Site and their contact details may be provided to you to indicate their interest in
          the Space.
        </p>
        <p>
          <br />
          <strong>Renter Requests</strong>
        </p>
        <p>
          As a Renter, you may create one or more Renter Requests. To this end, you will be asked a
          variety of questions about your requirements, including, but not limited to, the location
          and required space size. Renter Requests will be made publicly available via the Site and
          Services. Other Members will be able to view your Renter Request on the Site and their
          contact details may be provided to you to indicate their interest in your Renter Request.
        </p>
        <p>
          By making available any Member Content on or through the Site and Services, you hereby
          grant to us a worldwide, irrevocable, perpetual, non-exclusive, transferable, royalty-free
          license, with the right to sublicense, to use, view, copy, adapt, modify, distribute,
          license, sell, transfer, publicly display, publicly perform, transmit, stream, broadcast,
          access, view, and otherwise exploit such Member Content on, through or by means of the
          Site and Services.
        </p>
        <p>
          <br />
          You acknowledge and agree that you are solely responsible for all Member Content that you
          make available through the Site and/or Services. Accordingly, you represent and warrant
          that: (i) you either are the sole and exclusive owner of all Member Content that you make
          available through the Site and Services or you have all rights, licenses, consents and
          releases that are necessary to grant to us the rights in such Member Content, as
          contemplated under these Terms; and (ii) neither the Member Content nor your posting,
          uploading, publication, submission or transmittal of the Member Content or our use of the
          Member Content (or any portion thereof) on, through or by means of the Site and the
          Services will infringe, misappropriate or violate a Third Party’s patent, copyright,
          trademark, trade secret, moral rights or other proprietary or intellectual property
          rights, or rights of publicity or privacy, or result in the violation of any applicable
          law or regulation. Please note that we assume no responsibility for a Space Owner’s
          compliance with any applicable laws, rules and regulations.
        </p>
        <p>
          <br />
          <strong>Booking and Financial Terms</strong>
        </p>
        <p>Space Owners</p>
        <p>
          When a Renter requests a viewing of your Space via the Site or Services, we will notify
          you of this request via email. You are requested to either approve or decline the Renter’s
          request in a timely manner. When you confirm a viewing request by a Renter, we will share
          with you a link to the Renter’s Heybarn Profile page, including the contact name and email
          address of the Renter. Responsibility for arranging a viewing of the Space with the Renter
          will sit solely with the Space Owner and no guarantee is provided of reminder
          notifications to either the Space Owner or Renter.
        </p>
        <p>
          As a Space Owner, you acknowledge and agree that you are responsible for your own acts and
          omissions and are also responsible for the acts and omissions of any individuals who are
          present at the Space at your request or invitation, including the Renter (and the
          individuals the Renter invites to the Space, if applicable).
        </p>
        <p>Renters</p>

        <p>Space Move-Out Duties</p>
        <p>
          At or before the end of the Booking period for the Space, the Renter must vacate the Space
          completely. The Renter must remove all contents and debris. The Renter must leave the
          Space in good “broom clean” condition. Once the Renter has removed all Stored Items, paid
          all outstanding Fees, left the Space in the condition required, and its Booking has been
          cancelled, the Renter no longer has any right to access or take possession of the Space.
          Any dispute and/or litigation between Renters and Space Owners regarding direct payments
          shall be between Space Owners and Renters exclusively and shall not name Heybarn.
        </p>

        <p>
          You understand and agree that we do not act as an insurer or as a contracting agent for
          you as a Space Owner. If a Renter requests a Booking of your Space and stores Stored Items
          in or uses your Space, any agreement you enter into with such Renter is between you and
          the Renter and Heybarn is not a party thereto.
        </p>

        <p>Taxes</p>
        <p>
          You understand and agree that you are solely responsible for determining your applicable
          tax reporting requirements in consultation with your tax advisors. We cannot and do not
          offer tax-related advice to any Members of the Site and Services. Additionally, please
          note that each Space Owner is responsible for determining local indirect taxes.
        </p>
        <p>
          <strong>Damage to Property Terms</strong>
        </p>
        <p>
          Renters and Space Owners are solely responsible for the contractual relationship between
          them, and they agree not to involve heybarn in any dispute between them. In addition, they
          are responsible to provide their own insurance to cover damages that may occur to the
          Space Owner’s property or to the Stored Items the Renter stores with the Space Owner.
        </p>
        <p>
          <strong>No Endorsement</strong>
        </p>
        <p>
          We do not endorse any Members or any Space. You are responsible for determining the
          suitability of others who you contact or contact you via the Site and Services. We will
          not be responsible for any damage or harm resulting from your interactions with other
          Members.
        </p>
        <p>
          <br />
          By using the Site or Services, you agree that any legal remedy or liability that you seek
          to obtain for actions or omissions of other Members or other third parties will be limited
          to a claim against the particular Members or other third parties who caused you harm and
          you agree not to attempt to impose liability on or seek any legal remedy from us with
          respect to such actions or omissions. Accordingly, we encourage you to communicate
          directly on the Site with other Members and/or Services regarding any Bookings, Listings
          or Renter Requests made by you.
        </p>
        <p>
          <strong>Use of Space and Prohibited Items</strong>
        </p>
        <p>
          The Renter agrees not to use the Space for any unlawful purpose. The Space is to be used
          by the Renter only for storage of personal property, business activities or events. Use of
          the Space for any other purpose is strictly prohibited. Storage of the following items is
          expressly prohibited:
        </p>
        <ul>
          <li>
            <p>Explosives, fuel, hazardous or flammable materials</p>
          </li>
          <li>
            <p>Pesticides or other toxic chemicals</p>
          </li>
          <li>
            <p>Waste of any kind</p>
          </li>
          <li>
            <p>Firearms or ammunition</p>
          </li>
          <li>
            <p>Drugs or any illegal substances or goods</p>
          </li>
          <li>
            <p>Stolen goods or other contraband</p>
          </li>
          <li>
            <p>
              Perishable food items, spoiled food, living or deceased animals, infested items, or
              mouldy items
            </p>
          </li>
          <li>
            <p>Any item that emits fumes or a strong odour</p>
          </li>
          <li>
            <p>
              Any other items specifically identified by the Space Owner on the Listing as expressly
              prohibited
            </p>
          </li>
          <li>
            <p>
              Any other items, the possession, usage, transport or storage of which may violate in
              any way applicable laws, rules or regulations.
            </p>
          </li>
        </ul>
        <p>
          <br />
          Upon breach, or a Space Owner’s reasonable suspicion of breach, of these Terms, the Renter
          agrees that the Space Owner has the right to immediately terminate the Booking and to ask
          Renter to remove the Stored Items from the Space Owner’s premises. The Space Owner shall
          provide reasonable notice and opportunity for Renter to cure such breach or otherwise
          remove such Stored Items. If the Renter does not cure its breach or remove such Stored
          Items upon reasonable notice and opportunity to cure, the Space Owner may take all legally
          permissible actions, in its reasonable discretion, which actions may include, without
          limitation, forfeiture of the Stored Items pursuant to applicable law. The Space Owner may
          also contact law enforcement or other authorities to report illegal activities of Renter.
          If the Space Owner reasonably suspects the storage of items in breach of the above
          prohibitions, or other illegal activities, the Renter hereby gives permission for
          authorities to search the Stored Items without a warrant. The Renter agrees to release,
          indemnify, and hold the Space Owner harmless from and against any and all liability
          arising from or relating to the removal or forfeiture of stored property pursuant to these
          Terms, or the Renter’s breach, including any allegations or investigations relating
          thereto. The Renter shall forfeit all Fees paid up the date of termination hereunder.
        </p>
        <p>
          <strong>Risk of Personal Injury Due to Space Owner’s Negligence</strong>
        </p>
        <p>
          Renter agrees that the use of the Space is at Renter’s sole risk. Renter agrees that,
          without limiting any duties of the Space Owner to take reasonable steps to protect Stored
          Items, the Space Owner shall have no liability to the Renter or Renter’s invitees for any
          personal or bodily injury except in the event of the Space Owner’s gross negligence or
          wilful misconduct. The Renter hereby waives and disclaims any and all claims or causes of
          action the Renter may have against the Space Owner, in the event of personal or bodily
          injury to the Renter or the Renter’s invitees, except as a result of the Space Owner’s
          gross negligence or wilful misconduct.
        </p>
        <p>
          <strong>Space Owner Rules</strong>
        </p>
        <p>
          The Renter, Renter’s employees, agent, family, guests and other invitees agree to comply
          with the Space Owner’s rules and policies and any other rules which are contained in the
          Listing or otherwise agreed to by the Renter. Failure to comply with such rules may result
          in (i) the Renter being held in Default (as described in the Section “Default by Renter”
          below) and (ii) the Renter being held liable for damages to the Space Owner’s property or
          Space.
        </p>
        <p>
          <strong>Default by Renter</strong>
        </p>
        <p>Renter will be in “default” if:</p>
        <ul>
          <li>
            <p>(a) Renter has failed to pay any sum when due under the Listing, or</p>
          </li>
          <li>
            <p>
              (b) Renter has failed to notify Space Owner and Heybarn of a change in Renter’s
              address, e-mail address, or phone number as required in these terms; or
            </p>
          </li>
          <li>
            <p>
              (c) Renter has provided false or incorrect information to Space Owner or to Heybarn;
              or
            </p>
          </li>
          <li>
            <p>
              (d) Renter has failed to vacate the Space by the end of the rental period or the date
              on which Renter is to vacate as required by the Host; or
            </p>
          </li>
          <li>
            <p>
              (e) Renter has failed to comply with any other provision of these Terms, or any
              supplemental rules in the Listing or provided by the Space Owner; or
            </p>
          </li>
          <li>
            <p>
              (f) Renter has violated health, safety or criminal laws on the Space Owner’s property,
              regardless of whether arrest or conviction has occurred. Failure of Heybarn or the
              Space Owner to enforce any of these Terms shall not constitute waiver of such Term(s).
            </p>
          </li>
        </ul>
        <p>
          <strong>Indemnification</strong>
        </p>
        <p>
          You agree to release, defend, indemnify, and hold heybarn and our affiliates and
          subsidiaries, and their officers, directors, employees and agents, harmless from and
          against any claims, liabilities, damages, losses, and expenses, including, without
          limitation, reasonable legal and accounting fees, arising out of or in any way connected
          with:
          <br />
          (a) your access to or use of the Site, Services, or Collective Content or your violation
          or breach of these Terms<br></br>
          (b) your Member Content<br></br>
          (c) any injury occurring to any person or property as a result of the use, occupancy,
          travel to or from, or the entry or exit from, any Space by you<br></br>
          (d) your (i) interaction with any Member, (ii) Booking of a Space, (iii) creation of a
          Listing or (iv) the use, condition or rental of a Space by you, including, but not limited
          to any injuries, losses, or damages (compensatory, direct, incidental, consequential or
          otherwise) of any kind arising in connection with or as a result of a rental, Booking or
          use of a Space<br></br>
          (e) any dispute between you and another user of the Site or Services; and<br></br>
          (f) any infringement or misappropriation of the third party’s rights.
        </p>
        <p>
          <strong>Arbitration</strong>
        </p>
        <p>
          You and Heybarn mutually agree and acknowledge that all claims and disputes arising under
          or relating to these Terms and Conditions, or the breach, termination, enforcement, or
          interpretation or validity thereof are to be settled by binding arbitration in Dunedin,
          New Zealand, or another location mutually agreeable to the parties, and not in a court of
          law. Such arbitration will occur only after you and Heybarn have taken good faith efforts
          to resolve the dispute and such dispute has failed to be resolved. The arbitration shall
          be administered by a member of the Arbitrators’ and Mediators’ Institute of New Zealand
          and shall be conducted on a confidential basis.
        </p>
        <p>
          <br />
          You and Heybarn both waive the right to trial by jury in all arbitrable disputes. You and
          Heybarn also both acknowledge and agree that we are each waiving the right to
          participating as a plaintiff or class member in any purported class action or
          representative proceeding in all such disputes. Further, unless You and Heybarn otherwise
          agree in writing, any arbitration will be conducted on an individual basis and not in a
          class, collective, consolidated, or representative proceeding.
        </p>
        <p>
          <br />
          Any decision or award as a result of any such arbitration proceeding shall be in writing
          and shall provide an explanation for all conclusions of law and fact and shall include the
          assessment of costs, expenses, and reasonable attorneys’ fees. Any such arbitration shall
          be conducted by an arbitrator experienced in the “Sharing Economy,” and shall include a
          written record of the arbitration hearing. The parties reserve the right to object to any
          individual who shall be employed by or affiliated with a competing organization or entity.
          An award of arbitration may be confirmed in a court of competent jurisdiction. The parties
          shall endeavour to settle any such dispute via good faith negotiation prior to initiating
          any arbitration proceeding.
        </p>
        <p>
          <br />
          Exceptions to this arbitration provision include (i) any claim related to actual or
          threatened infringement, misappropriation, or violation of a party’s copyrights,
          trademarks, trade secrets, patents or other intellectual property rights; or (ii) any
          claim seeking emergency injunctive relief based on exigent circumstances. Any claim in
          exception to the above agreement to arbitration shall be brought into judicial proceeding
          in a court of competent jurisdiction in Dunedin, New Zealand.
        </p>
        <p>
          <br />
          If any portion of this arbitration provision is found to be unenforceable or unlawful,
          those unenforceable or unlawful portions shall be severed from these terms. The severance
          of unenforceable or unlawful portions of this arbitration provision shall not have any
          impact on the remainder of the arbitration provision, which shall be given full force and
          effect.
        </p>
        <p>
          <br />
          To the extent any disputed matter arising out of or relating to these Terms is deemed to
          not be subject to these arbitration provisions, such portion of any disputed matter shall
          be brought exclusively in the court located at Dunedin, New Zealand, and the parties do
          hereby submit to the exclusive jurisdiction of those court.
        </p>
        <p>
          <strong>Feedback</strong>
        </p>
        <p>
          We welcome and encourage you to provide feedback, comments and suggestions for
          improvements to the Site and Services (“Feedback”). You may submit Feedback by emailing us
          at <u>enquiries@heybarn.co.nz</u> or through the “Contact” section of the Site. You
          acknowledge and agree that all Feedback will be the sole and exclusive property of Heybarn
          and you hereby irrevocably assign to us and agree to irrevocably assign to us all of your
          right, title, and interest in and to all Feedback, including without limitation all
          worldwide patent, copyright, trade secret, moral and other proprietary or intellectual
          property rights therein. At our request and expense, you will execute documents and take
          such further acts as we may reasonably request to assist us to acquire, perfect, and
          maintain its intellectual property rights and other legal protections for the Feedback.
        </p>
        <p>
          <strong>Intellectual property</strong>
        </p>
        <p>
          The format and Collective Content of this Site is protected by New Zealand and
          international copyright. We reserve all rights in relation to our copyright whether owned
          or licensed to us and all rights are reserved to our registered and unregistered
          trademarks (whether owner or licensed to us) which appear on this Site. By displaying
          user-generated Member Content on this Site, you expressly assign all copyright and other
          rights to such Content to us (and you agree to waive all moral rights in relation to such
          Content). We are permitted to use any Member Content for any of our other business
          purposes, even following termination or your registration or membership.
        </p>

        <p>
          We do not screen Member Content (including content relating to available Space Owner
          spaces) or information on the Site and we cannot give any assurance as to its accuracy or
          completeness. Users are expressly asked not to publish any Content which infringes any
          other person’s intellectual property rights (e.g. copyright). Any such Content is contrary
          to our policy and we do not accept liability in respect of such Content. The user
          responsible will be personally liable for any damages or other liability arising and you
          agree to indemnify us in relation to any liability we may suffer as a result of such
          Content.
        </p>
        <p>
          If, at any time, you would like to contact us with your views about our terms of use, you
          can do so by emailing us at&nbsp;
          <a href="mailto:enquiries@heybarn.co.nz">enquiries@heybarn.co.nz</a>. It is our policy to
          terminate in appropriate circumstances the Heybarn Accounts of Members or other account
          holders who repeatedly infringe or are believed to be repeatedly infringing the rights of
          third-party copyright holders. If you are a copyright owner, or are authorized to act on
          behalf of one, please report alleged copyright infringement by submitting the following
          information to <a href="mailto:enquiries@heybarn.co.nz">enquiries@heybarn.co.nz</a>.
          Identify the copyrighted work that you claim has been infringed, or if multiple
          copyrighted works are covered by this Notice, provide a comprehensive list of the
          copyrighted works that you claim have been infringed.
        </p>
        <p>
          <strong>Miscellaneous</strong>
        </p>
        <p>
          These Terms are the final and complete integration of the parties’ agreement as it relates
          to the topics addressed in these Terms. If these Terms become subject to any litigation or
          arbitration, the prevailing party in any such litigation or arbitration will be entitled
          to recover its reasonable attorneys’ fees and court or arbitration costs from the
          non-prevailing party. We will not be deemed to have waived any portion of these Terms
          because of its delay or other failure to assert its rights under these Terms, unless the
          waiver is in writing and signed by us.
        </p>
      </div>
    </div>
  );
};

TermsOfService.defaultProps = {
  rootClassName: null,
  className: null,
};

const { string } = PropTypes;

TermsOfService.propTypes = {
  rootClassName: string,
  className: string,
};

export default TermsOfService;
