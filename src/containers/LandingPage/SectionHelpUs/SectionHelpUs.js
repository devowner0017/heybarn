
import React from 'react'
import { NamedLink } from '../../../components'
import css from './SectionHelpUs.module.css'

const SectionHelpUs = () => {
  return (
    <div className={css.root}>
      <div className={css.container}>
        <div className={css.content}>
          <h2 className={css.title}>Help us grow & support the Westpac Chopper Appeal</h2>
          <p className={css.text}>
            Do you know a Kiwi or three who have space to spare or need affordable space to rent? Recommending heybarn to your friends and family is easy:<br /><br />
            
            1. Send a referral to your email contacts,<br />
            2. Share on Facebook, and<br />
            3. Every time one of your contacts lists on heybarn, we’ll donate $10 to the Westpac Chopper Appeal<br /><br />
            
            Heybarn is on a mission to empower Kiwis to rent unused space direct from other Kiwis. Help us spread the word by recommending heybarn to your friends and family.
          </p>
        </div>
        <div className={css.sectionReffer}>
          <NamedLink
            name="SearchPage"
            to={{
              search: 'pub_listingType=listing&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618',
            }}
            className={css.buttonEmail}
          >
            <div>REFER YOUR EMAIL CONTACTS</div>
            <IconMail />
          </NamedLink>

          <NamedLink
            name="SearchPage"
            to={{
              search: 'pub_listingType=listing&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618',
            }}
            className={css.buttonFacebook}
          >
            <div>SHARE ON FACEBOOK</div>
            <IconFacebook />
          </NamedLink>

          <NamedLink
            name="SearchPage"
            to={{
              search: 'pub_listingType=listing&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618',
            }}
          >
            <Logo />
          </NamedLink>
        </div>
      </div>
    </div>
  )
}

export default SectionHelpUs

const IconMail = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} {...props}>
    <path
      data-name="Icon awesome-envelope-open-text"
      d="M12.375 15.188h11.25a1.125 1.125 0 0 0 1.125-1.125v-1.125a1.125 1.125 0 0 0-1.125-1.125h-11.25a1.125 1.125 0 0 0-1.125 1.125v1.125a1.125 1.125 0 0 0 1.125 1.125Zm-1.125 5.625a1.125 1.125 0 0 0 1.125 1.125h11.25a1.125 1.125 0 0 0 1.125-1.125v-1.125a1.125 1.125 0 0 0-1.125-1.125h-11.25a1.125 1.125 0 0 0-1.125 1.125ZM18 29.329a5.617 5.617 0 0 1-3.295-1.068L0 17.639v14.986A3.375 3.375 0 0 0 3.375 36h29.25A3.375 3.375 0 0 0 36 32.625V17.639L21.295 28.261A5.622 5.622 0 0 1 18 29.329Zm16.707-17.872c-.622-.488-1.212-.947-2.082-1.6V6.75a3.375 3.375 0 0 0-3.375-3.375H23.8l-.636-.461C21.98 2.051 19.631-.025 18 0c-1.631-.025-3.979 2.051-5.162 2.914l-.636.461H6.75A3.375 3.375 0 0 0 3.375 6.75v3.1c-.87.656-1.46 1.116-2.082 1.6A3.375 3.375 0 0 0 0 14.113v.749l6.75 4.876V6.75h22.5v12.988L36 14.862v-.749a3.375 3.375 0 0 0-1.293-2.656Z"
      fill="#fff"
    />
  </svg>
)

const IconFacebook = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} {...props}>
    <g data-name="Group 448" transform="translate(-1650 -4947.213)">
      <circle
        data-name="Ellipse 31"
        cx={18}
        cy={18}
        r={18}
        transform="translate(1650 4947.213)"
        fill="#fff"
      />
      <path
        data-name="Icon awesome-facebook-f"
        d="m1672.239 4966.714.624-4.064h-3.9v-2.637a2.032 2.032 0 0 1 2.291-2.2h1.773v-3.455a21.619 21.619 0 0 0-3.146-.275c-3.211 0-5.31 1.946-5.31 5.47v3.1H1661v4.064h3.57v9.824h4.394v-9.827Z"
        fill="#6d692b"
      />
    </g>
  </svg>
)

const Logo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={246}
    height={58.927}
    {...props}
  >
    <defs>
      <clipPath id="a">
        <path
          data-name="Path 26"
          d="M0-5.566h246v-58.926H0Z"
          transform="translate(0 64.492)"
          fill="#fff"
        />
      </clipPath>
    </defs>
    <g data-name="Group 447">
      <g data-name="Group 1">
        <path
          data-name="Path 6"
          d="M84.048 52.29h4.259V16.825l-4.259-2.317Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 2">
        <path
          data-name="Path 7"
          d="M35.019 52.29h4.26V9.849l-4.26 2.317Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 3">
        <path
          data-name="Path 8"
          d="M77.044 52.29h4.259V13.019l-4.259-2.322Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 4">
        <path
          data-name="Path 9"
          d="m74.302 9.204-4.26-2.317v22.08h4.26Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 5">
        <path
          data-name="Path 10"
          d="m57.382 0-1.35.736v28.23h4.259V1.583Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 6">
        <path
          data-name="Path 11"
          d="M28.015 52.291h4.26V13.66l-4.26 2.318Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 7">
        <path
          data-name="Path 12"
          d="m67.297 5.393-4.26-2.317v25.891h4.26Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 8">
        <path
          data-name="Path 13"
          d="M7.003 52.291h4.26V20.318l-4.26.846Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 9">
        <path
          data-name="Path 14"
          d="M14.008 52.291h4.26V18.926l-4.26.846Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 10">
        <path
          data-name="Path 15"
          d="M21.012 18.381V52.29h4.259V17.467l-.186.1Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 11">
        <path
          data-name="Path 16"
          d="M0 22.555v29.736h4.259V21.709Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 12">
        <path
          data-name="Path 17"
          d="M49.027 52.291h4.26V2.228l-4.26 2.317Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 13">
        <path
          data-name="Path 18"
          d="M42.024 52.29h4.259V6.038l-4.259 2.321Z"
          fill="#fff"
        />
      </g>
      <g data-name="Group 21" clipPath="url(#a)">
        <g data-name="Group 14">
          <path
            data-name="Path 19"
            d="M127.431 30.066c-6.149 0-10.445 5.129-10.445 11.356v.082c0 6.675 4.69 11.275 11.037 11.275a10.437 10.437 0 0 0 8.633-4.071l-3.43-3.133a6.818 6.818 0 0 1-5.125 2.238 4.938 4.938 0 0 1-5.163-4.274h14.7c.04-.57.079-1.139.079-1.628.001-6.186-3.23-11.845-10.286-11.845m-4.573 9.607c.474-2.807 2.09-4.641 4.573-4.641 2.523 0 4.1 1.872 4.454 4.641Z"
            fill="#fff"
          />
        </g>
        <g data-name="Group 15">
          <path
            data-name="Path 20"
            d="m148.393 45.334-4.808-14.861h-6.347l8.277 21.9a2 2 0 0 1-2.089 1.424 5.33 5.33 0 0 1-2.562-.854l-2.01 4.477a9.684 9.684 0 0 0 5.321 1.507c3.587 0 5.321-1.669 6.938-6.106l8.12-22.347h-6.227Z"
            fill="#fff"
          />
        </g>
        <g data-name="Group 16">
          <path
            data-name="Path 21"
            d="M198.078 30.229a18.136 18.136 0 0 0-8.2 1.751l1.5 4.721a15.123 15.123 0 0 1 5.833-1.18c3 0 4.533 1.424 4.533 3.988v.366a14.609 14.609 0 0 0-5.163-.9c-5.006 0-8.515 2.2-8.515 6.961v.081c0 4.314 3.272 6.675 7.253 6.675a8.005 8.005 0 0 0 6.386-2.763v2.361h5.794V39.629c0-2.931-.71-5.332-2.286-6.961-1.498-1.539-3.863-2.439-7.135-2.439m3.746 14.369c0 2.239-1.893 3.831-4.691 3.831-1.932 0-3.272-.977-3.272-2.645v-.082c0-1.953 1.577-3.012 4.139-3.012a9.052 9.052 0 0 1 3.824.809Z"
            fill="#fff"
          />
        </g>
        <g data-name="Group 17">
          <path
            data-name="Path 22"
            d="M217.407 34.868v-4.4h-5.991v21.823h5.991v-8.06c0-5.211 2.444-7.693 6.425-7.693h.315v-6.473c-3.547-.163-5.518 1.792-6.74 4.803"
            fill="#fff"
          />
        </g>
        <g data-name="Group 18">
          <path
            data-name="Path 23"
            d="M238.827 30.066c-3.036 0-4.809 1.669-6.189 3.5v-3.093h-5.992v21.818h5.992V40.12c0-2.931 1.458-4.438 3.744-4.438s3.627 1.507 3.627 4.438v12.17h5.992V38.166c0-5.006-2.642-8.1-7.174-8.1"
            fill="#fff"
          />
        </g>
        <g data-name="Group 19">
          <path
            data-name="Path 24"
            d="M107.692 30.066c-3.035 0-4.809 1.669-6.188 3.5v-9.7l-5.992-3.26v31.685h5.992V40.12c0-2.931 1.458-4.438 3.744-4.438s3.626 1.507 3.626 4.438v12.17h5.992V38.166c0-5.006-2.642-8.1-7.174-8.1"
            fill="#fff"
          />
        </g>
        <g data-name="Group 20">
          <path
            data-name="Path 25"
            d="M176.542 30.066a7.7 7.7 0 0 0-6.583 3.543V23.338l-5.991-3.26V52.29h5.991v-2.848a8.031 8.031 0 0 0 6.583 3.256c5.006 0 9.618-3.99 9.618-11.276v-.081c0-7.286-4.69-11.275-9.618-11.275m3.627 11.356c0 3.663-2.366 6.024-5.164 6.024s-5.124-2.4-5.124-6.024v-.081c0-3.623 2.326-6.024 5.124-6.024s5.164 2.4 5.164 6.024Z"
            fill="#fff"
          />
        </g>
      </g>
    </g>
  </svg>
)
