# Abhay Chaurasiya - Personal Portfolio Website

A modern, responsive, and animated personal portfolio website built with Next.js, Tailwind CSS, and Framer Motion. This portfolio showcases my skills, experience, and projects as a Full-Stack Developer.

## ✨ Features

### 🎨 Design & UI
- **Modern & Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **Dark/Light Mode Toggle** - Smooth theme switching with system preference detection
- **Smooth Animations** - Powered by Framer Motion and GSAP for engaging user experience
- **Interactive Elements** - Hover effects, micro-interactions, and smooth transitions
- **Professional Layout** - Clean, recruiter-friendly design with excellent UX

### 🚀 Sections
- **Hero Section** - Animated introduction with particle background and call-to-action buttons
- **About Me** - Personal bio, contact information, and quick stats
- **Skills & Technologies** - Categorized skills with animated progress bars
- **Work Experience** - Timeline layout with detailed work history
- **Projects Portfolio** - Featured projects with filtering and tech stack badges
- **Contact Form** - Interactive contact form with social media links
- **Footer** - Quick navigation and additional information

### 🛠️ Technical Features
- **Next.js 14** - Latest React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Advanced animations and transitions
- **GSAP** - High-performance animations
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags, Open Graph, and structured data
- **Performance Optimized** - Lazy loading, optimized images, and efficient animations

## 🎯 Target Audience

This portfolio is designed for:
- **Recruiters & Hiring Managers** - Professional presentation of skills and experience
- **Potential Clients** - Showcase of project capabilities and technical expertise
- **Fellow Developers** - Technical demonstration and code quality
- **Professional Network** - Professional online presence and branding

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhay1999/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles and custom CSS
├── components/
│   ├── Header.tsx          # Navigation header with theme toggle
│   ├── Hero.tsx            # Hero section with animations
│   ├── About.tsx           # About section with contact info
│   ├── Skills.tsx          # Skills with progress bars
│   ├── Experience.tsx      # Work experience timeline
│   ├── Projects.tsx        # Projects portfolio
│   ├── Contact.tsx         # Contact form and social links
│   ├── Footer.tsx          # Footer with navigation
│   └── theme-provider.tsx  # Theme context provider
└── types/                  # TypeScript type definitions
```

## 🎨 Customization

### Personal Information
Update the following files with your information:
- `src/components/Hero.tsx` - Name, role, and description
- `src/components/About.tsx` - Bio and contact details
- `src/components/Experience.tsx` - Work history
- `src/components/Projects.tsx` - Project details and links
- `src/components/Contact.tsx` - Contact information

### Styling
- **Colors**: Modify the color scheme in `tailwind.config.ts`
- **Fonts**: Update font imports in `src/app/globals.css`
- **Animations**: Customize animation parameters in component files

### Content
- **Projects**: Add/remove projects in the Projects component
- **Skills**: Update skill categories and proficiency levels
- **Experience**: Modify work experience timeline
- **Social Links**: Update social media and professional profile links

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
- **Netlify**: Build command: `npm run build`, Publish directory: `out`
- **AWS Amplify**: Connect your repository and deploy
- **GitHub Pages**: Use `next export` and deploy static files

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌙 Dark Mode

- **System Preference**: Automatically detects user's system theme
- **Manual Toggle**: Users can manually switch between light and dark modes
- **Persistent**: Theme preference is saved in localStorage

## ⚡ Performance

- **Lazy Loading**: Components load as they come into view
- **Optimized Images**: Next.js Image component for optimal loading
- **Code Splitting**: Automatic code splitting by Next.js
- **Minified CSS**: Tailwind CSS is purged and minified in production

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Adding New Sections
1. Create a new component in `src/components/`
2. Add it to `src/app/page.tsx`
3. Update navigation in `src/components/Header.tsx`
4. Add corresponding styles and animations

## 📊 Analytics & SEO

- **Meta Tags**: Comprehensive meta tags for social sharing
- **Open Graph**: Facebook and Twitter card support
- **Structured Data**: JSON-LD structured data for search engines
- **Performance Monitoring**: Ready for Google Analytics integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Lucide Icons** - For beautiful icons
- **Inter Font** - For the modern typography

## 📞 Contact

- **Email**: abhaychaurasiya19@gmail.com
- **Phone**: +91 8299211830
- **GitHub**: [@abhay1999](https://github.com/abhay1999)
- **LinkedIn**: [Abhay Chaurasiya](https://linkedin.com/in/abhay-chaurasiya)

---

**Built with ❤️ using Next.js, Tailwind CSS, and Framer Motion**
