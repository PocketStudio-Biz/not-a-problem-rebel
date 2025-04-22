# Not A Problem - React + Supabase Application

A modern web application built with React, TypeScript, and Supabase, offering a clean UI with shadcn components.

## Features

- **Authentication** - User login and registration powered by Supabase Auth
- **Real-time Data** - Leveraging Supabase's real-time capabilities
- **Modern UI** - Clean design using shadcn/ui components and Tailwind CSS
- **TypeScript** - Type-safe development experience
- **Vite** - Fast development and optimized production builds

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Supabase account and project

### Installation

1. Clone the repository

   ```sh
   git clone https://github.com/yourusername/not-a-problem-rebel.git
   cd not-a-problem-rebel
   ```

2. Install dependencies

   ```sh
   npm install
   ```

3. Configure environment variables
   Create a `.env` file in the root directory with the following variables:

   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_APP_ENV=development
   ```

4. Start the development server
   ```sh
   npm run dev
   ```

## Project Structure

```
not-a-problem-rebel/
├── public/               # Static assets
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # UI components
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # Third-party service integrations
│   │   └── supabase/     # Supabase client and types
│   ├── lib/              # Utility functions
│   ├── routes/           # Application routes
│   ├── styles/           # Global styles
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── .env                  # Environment variables
├── index.html            # HTML entry point
├── netlify.toml          # Netlify configuration
└── vite.config.ts        # Vite configuration
```

## Deployment

### Deploy to Netlify

This project is configured to work with Netlify. Follow these steps to deploy:

1. **Set up environment variables**:
   Make sure your `.env` file has the correct Supabase credentials:

   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_APP_ENV=production
   ```

2. **Deploy using PowerShell script** (Windows):

   ```
   .\deploy.ps1
   ```

   This will build your project and deploy it to Netlify

3. **Manual deployment**:

   ```sh
   npm run build
   netlify deploy --prod
   ```

4. **Connect to Netlify via GitHub**:
   - Go to [Netlify](https://app.netlify.com/)
   - Create a new site from Git
   - Connect to your GitHub repository
   - Configure with the following settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables in the Netlify dashboard

## Environment Variables

| Variable                 | Description                          | Required |
| ------------------------ | ------------------------------------ | -------- |
| VITE_SUPABASE_URL        | Your Supabase project URL            | Yes      |
| VITE_SUPABASE_ANON_KEY   | Your Supabase anonymous key          | Yes      |
| VITE_APP_ENV             | Environment (development/production) | Yes      |
| VITE_MAILERLITE_API_KEY  | MailerLite API key                   | No       |
| VITE_MAILERLITE_GROUP_ID | MailerLite group ID                  | No       |

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run deploy` - Build and deploy to Netlify

### Using Lovable

This project can also be managed through [Lovable](https://lovable.dev/projects/a56d7c30-5a75-44bf-8f99-570fcfa871a1):

- Visit the Lovable Project and start prompting
- Changes made via Lovable will be committed automatically to this repo

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
