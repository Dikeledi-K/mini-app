# iS'khaftin - Community Micro-Crowdfunding Platform

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Farcaster Mini App](https://img.shields.io/badge/Farcaster-Mini%20App-blue?style=for-the-badge)](https://farcaster.xyz/)
[![Base Blockchain](https://img.shields.io/badge/Base-Blockchain-0052FF?style=for-the-badge)](https://base.org/)

> **Ubuntu in Action** - "I am because we are"

iS'khaftin is a Farcaster Mini App that transforms social media engagement into direct community support through micro-crowdfunding. Built for South African communities, it embodies the spirit of Ubuntu by enabling small donations (R100 ≈ $5) to create meaningful impact.

## 🌟 Overview

iS'khaftin allows community members to:
- **Create campaigns** for local needs (education, healthcare, infrastructure)
- **Share on Farcaster** as interactive Frames that appear in social feeds
- **Receive micro-donations** directly through blockchain transactions
- **Track progress** transparently with on-chain records

## 🚀 Key Features

### 💰 Micro-Donations, Macro Impact
- **Low barrier entry**: R100 (~$5) suggested donations
- **Quick goal achievement**: A R2000 campaign needs only 20 supporters
- **Impulse-friendly**: Small amounts encourage spontaneous giving

### 🔗 Farcaster Integration
- **Native social sharing**: Campaigns appear as interactive Frames
- **Viral potential**: Easy sharing through social networks
- **Community discovery**: Built-in social media reach

### 🔒 Blockchain Transparency
- **On-chain records**: Every donation is publicly verifiable
- **No intermediaries**: Direct wallet-to-wallet transactions
- **Immutable history**: Complete transparency and trust

### 🌍 Ubuntu Philosophy
- **Community-first**: Built for South African communities
- **Collective support**: "I am because we are" in action
- **Mutual empowerment**: Strengthening community bonds

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI components
- **Blockchain**: Base network, Wagmi, Viem
- **Social**: Farcaster Mini App SDK, Coinbase OnchainKit
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 📱 How It Works

### For Campaign Creators

1. **Create Campaign**
   - Set a realistic goal (R500-R5000)
   - Add description and images
   - Choose category (Education, Healthcare, Infrastructure)

2. **Share on Farcaster**
   - Campaign becomes an interactive Frame
   - Appears directly in Farcaster feeds
   - Easy for network to discover and support

3. **Receive Donations**
   - Community members donate with one click
   - R100 suggested amount for impulse giving
   - Real-time progress tracking

4. **Goal Achievement**
   - Funds sent directly to your wallet
   - Complete transparency through blockchain
   - Community celebration of success

### For Donors

1. **Discover Campaigns**
   - Browse through Farcaster feeds
   - See campaigns from your network
   - Filter by category or location

2. **Quick Donation**
   - One-click donation through Frame
   - R100 suggested amount
   - Instant blockchain confirmation

3. **Track Impact**
   - See campaign progress in real-time
   - View donation history on-chain
   - Celebrate community achievements

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/frame/         # Farcaster Frame API routes
│   ├── create/            # Campaign creation page
│   ├── discover/          # Campaign discovery page
│   ├── dashboard/         # User dashboard
│   └── how-it-works/      # How it works page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── campaign-card.tsx # Campaign display component
│   ├── donation-modal.tsx # Donation interface
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── supabase/         # Database client
│   └── wagmi-config.ts   # Blockchain configuration
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- Base network wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dikeledi-K/mini-app.git
   cd mini-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   ```

4. **Database setup**
   ```bash
   # Run the SQL scripts in the scripts/ directory
   # to set up your Supabase database tables
   ```

5. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🎯 Campaign Types

### Education
- School supplies and textbooks
- Student uniforms and equipment
- Educational technology
- Teacher resources

### Healthcare
- Medical equipment and supplies
- Medication and treatment costs
- Healthcare access programs
- Emergency medical funds

### Infrastructure
- Community gardens and green spaces
- Water access and sanitation
- Sports equipment and facilities
- Small infrastructure improvements

## 🔧 API Endpoints

### Frame Endpoints
- `GET /api/frame` - Main Frame interface
- `GET /api/frame/discover` - Campaign discovery Frame
- `GET /api/frame/create` - Campaign creation Frame
- `GET /api/frame/campaign/[id]` - Individual campaign Frame
- `GET /api/frame/donate/[id]/[amount]` - Donation Frame

### Webhook Endpoints
- `POST /api/webhook` - Farcaster webhook handler

## 🤝 Contributing

We welcome contributions that align with the Ubuntu philosophy of community support:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the spirit of Ubuntu
- Inspired by South African community values
- Powered by Farcaster and Base blockchain
- Made possible by the open-source community

## 📞 Support

For support, questions, or community discussions:
- Open an issue on GitHub
- Join our community discussions
- Contact: Nonydikeledi@gmail.com

---

**Built with Ubuntu spirit for South African communities** 🇿🇦
