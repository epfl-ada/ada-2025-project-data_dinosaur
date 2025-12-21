'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Github, Linkedin, ArrowLeft, ArrowRight } from 'lucide-react';
import { Starburst } from './ComicElements';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';


import frequency_caption from '@/data/introduction/introduction_frequency_captions.json';
import image_location from '@/data/introduction/top_50_terms_image_locations.json';
import image_description from '@/data/introduction/top_50_terms_image_descriptions.json';
import summary_votes from '@/data/introduction/summary_votes.json';
import { title } from 'process';


interface AboutBookProps {
  onNext?: () => void;
  onPrev?: () => void;
}


export const ComicBox = ({ children, className = '', title }: { children: React.ReactNode, className?: string, title?: string }) => (
  <div className={`border-4 border-[#1A1A1A] bg-white p-4 relative ${className}`} style={{ boxShadow: '6px 6px 0 #1A1A1A' }}>
    {title && (
      <div className="absolute -top-4 left-4 bg-[#F4A261] border-2 border-[#1A1A1A] px-3 py-1 z-10">
        <h3 className="comic-title text-xs font-bold text-[#1A1A1A]">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

export const AnalysisText = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#FDFDF8] border-l-4 border-[#2A9D8F] p-4 my-4 font-mono text-xs leading-relaxed text-[#1A1A1A] opacity-90">
    {children}
  </div>
);

export function AboutBook({ onNext, onPrev }: AboutBookProps) {
  const [currentId, setCurrentId] = useState(510);
  const minId = 510;
  const maxId = 895;

  // Base path for GitHub Pages deployment
  const basePath = process.env.NODE_ENV === 'production' ? '/ada-2025-data-dinosaur-website' : '';

  const handlePrevImage = () => {
    setCurrentId((prev) => {
      let nextId = prev - 1;
      if (nextId === 525) nextId = 524; // Skip missing 525
      return nextId < minId ? maxId : nextId;
    });
  };

  const handleNextImage = () => {
    setCurrentId((prev) => {
      let nextId = prev + 1;
      if (nextId === 525) nextId = 526; // Skip missing 525
      return nextId > maxId ? minId : nextId;
    });
  };

  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [maxImage] = '514';

  React.useEffect(() => {
    const fetchCaption = async () => {
      try {
        const response = await fetch(`${basePath}/data/data_with_llm_top30/${currentId}.csv`);
        const text = await response.text();
        const lines = text.split('\n');
        if (lines.length > 1) {
          // Parse the first data line (index 1)
          // Regex to capture rank, then caption (quoted or unquoted)
          // Matches: start | digits | comma | "groups" OR non-comma | comma
          const match = lines[1].match(/^(\d+),(?:"([^"]*)"|([^,]*)),/);
          if (match) {
            // Group 2 is quoted caption, Group 3 is unquoted
            setCurrentCaption(match[2] || match[3] || '');
          }
        }
      } catch (error) {
        console.error('Error fetching caption:', error);
        setCurrentCaption('');
      }
    };

    fetchCaption();
  }, [currentId, basePath]);

  const findings = [
    {
      title: '',
      text: '240 labeled images from 2016 to 2021',
      color: '#E63946'
    },
    {
      title: '',
      text: '2\'263\'048 captions in total submitted between 2016 and 2023',
      color: '#F4A261'
    },
    {
      title: '',
      text: '287\'757\'060 votes in total between 2016 and 2023',
      color: '#457B9D'
    },
    {
      title: '',
      text: '749\'367 votes on average per contest',
      color: '#2A9D8F'
    }
  ];

  const contest_steps = [
    {
      title: 'Round 1: Submit',
      text: (
        <>
          Every week the readers can enter a caption of 250 characters or less for a new cartoon either on the{' '}
          <a
            href="https://www.newyorker.com/cartoons/contest"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold hover:opacity-70"
            style={{ color: 'inherit' }}
          >
            webpage
          </a>{' '}
          or on Instagram (@newyorkermag) using the hashtag #MyNewYorkerCaption.
        </>
      ),
      color: '#E63946'
    },
    {
      title: 'Round 2: Rate',
      text: 'Decide if the captions from the previous week are unfunny, somewhat funny or funny to help narrow down the finalists.',
      color: '#F4A261'
    },
    {
      title: 'Round 3: Vote',
      text: 'The three finalists are selected from each Contest by a member or members of the editorial staff of The New Yorker. Select the winning caption by voting on three finalists from the week prior. ',
      color: '#457B9D'
    },
    {
      title: 'Round 3: Winner',
      text: (
        <>
          The winner is shown the week after. The winner of each Contest will be the person whose caption received the greatest number of valid votes (“Votes”) from the public and who
          satisfies all of the rules (“Qualified Winner”).{' '}
          <a
            href="https://www.newyorker.com/about/caption-contest-rules"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold hover:opacity-70"
            style={{ color: 'inherit' }}
          >
            [rules]
          </a>
        </>
      ),
      color: '#2A9D8F'
    }
  ];


  return (
    <div className="h-full flex flex-col">
      {/* Page Title */}


      {/* Two Column Layout with Separator */}
      <div className="flex flex-row gap-0 flex-1 relative">
        {/* Left Column - Story & Cartoons */}
        <div className="flex-1 pr-8">
          <div className="inline-block mb-4 px-4 py-2 bg-[#457B9D] border-3 border-[#1A1A1A]">
            <h2 className="comic-title text-sm text-[#FDFDF8]">Introduction</h2>
          </div>

          <div className="border-4 border-[#1A1A1A] p-4 bg-white mb-4" style={{ boxShadow: '4px 4px 0 #1A1A1A' }}>
            <div className="space-y-3 comic-text text-xs leading-relaxed">
              <p>
                The New Yorker Cartoon-caption contest started in 1998 as an annual event. In 2005 it was then changed into a weekly event.
                <a href="https://www.newyorker.com/magazine/2005/05/02/your-caption-here">[1] </a>
              </p>
              <p>
                Participants are invited to submit their own humorous captions for a selected cartoon published in The New Yorker magazine.
              </p>
              <p>
                Anyone aged 13 or older can enter, with one entry allowed per person, email address, or Instagram account. Employees,
                affiliates, or family members connected to the contest’s organizers are not eligible to participate.
              </p>

              <div className="space-y-3 mb-4">
                {contest_steps.map((contest_steps, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-4 border-[#1A1A1A] p-3 bg-white"
                    style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="w-2 h-2 border-2 border-[#1A1A1A] rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: contest_steps.color }}
                      />
                      <div>
                        <h4 className="comic-title text-xs mb-1" style={{ color: contest_steps.color }}>
                          {contest_steps.title}
                        </h4>
                        <p className="comic-text text-[10px] opacity-80">
                          {contest_steps.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>


            </div>


          </div>
          <ComicBox title="Cartoons" className="mb-4">
            <div
              className="mb-4"
              style={{
                backgroundColor: 'transparent',
                paddingTop: '2rem',
                paddingBottom: '3rem',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >



              {/* Aligned Container for Everything */}
              <div style={{ width: '440px', maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <p className="comic-text text-sm mb-6 text-center w-full" style={{ fontWeight: 'bold', fontStyle: 'italic' }}>#{currentId}</p>

                {/* Caption Display */}
                <div className="min-h-[3rem] mb-4 flex items-end justify-center px-4">
                  <p className="comic-text text-lg text-center font-bold leading-tight w-full">
                    {currentCaption && `"${currentCaption}"`}
                  </p>
                </div>

                {/* The Square - Now Displaying Images */}
                <div
                  style={{
                    width: '100%',
                    height: '350px',
                    border: '6px solid #000000ff',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '4px 4px 0 #1A1A1A'
                  }}
                >
                  <img
                    src={`${basePath}/data/images/${currentId}.jpg`}
                    alt={`New Yorker Cartoon ${currentId}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Navigation Buttons */}
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <button
                    onClick={handlePrevImage}
                    className="interactive-cta bg-white text-[#1A1A1A] hover:opacity-100 transition-opacity"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="interactive-cta bg-[#F4A261] text-white"
                  >
                    Next →
                  </button>
                </div>
              </div>

            </div>
          </ComicBox>
        </div>

        <ComicBox title="The dataset" className="mb-8">
          <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
            For each cartoon, the data includes a unique contest ID, the image, a description of the image, the image location, and an "uncanny" description highlighting why the scene is funny or disturbingly quirky. The dataset also contains engagement stats like the total number of captions submitted and votes received.
            This data is labeled from 2016-2021 and includes 240 contests.
          </p>
          <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
            For every submitted caption, the dataset includes the unique contest ID, the caption's rank, total votes received, and a breakdown of funny, somewhat funny, and not funny votes.
            The caption data is available from 2016-2023 and includes 384 contests.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
            {findings.map((finding, index) => {
              // Extract main number from text
              const numberMatch = finding.text.match(/^([0-9,']+)/);
              const mainNumber = numberMatch ? numberMatch[1] : finding.text;
              const remainingText = finding.text.replace(mainNumber, '').trim();
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9, rotateZ: -2 }}
                  animate={{ opacity: 1, scale: 1, rotateZ: index % 2 === 0 ? 1 : -1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateZ: 0,
                    boxShadow: `12px 12px 0 #1A1A1A, 
                                8px 8px 0 ${finding.color}, 
                                0 0 30px ${finding.color}80,
                                inset 0 0 0 3px ${finding.color}60`
                  }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
                  className="border-4 border-[#1A1A1A] bg-white relative overflow-hidden cursor-pointer"
                  style={{ 
                    boxShadow: `8px 8px 0 #1A1A1A, 
                                6px 6px 0 ${finding.color}, 
                                0 0 20px ${finding.color}40,
                                inset 0 0 0 3px ${finding.color}40`,
                    borderRadius: '4px',
                    minHeight: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                  }}
                >
                  {/* Corner decorations */}
                  <div 
                    className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4"
                    style={{ borderColor: finding.color }}
                  />
                  <div 
                    className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4"
                    style={{ borderColor: finding.color }}
                  />
                  <div 
                    className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4"
                    style={{ borderColor: finding.color }}
                  />
                  <div 
                    className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4"
                    style={{ borderColor: finding.color }}
                  />
                  
                  <div 
                    className="absolute inset-0 opacity-5"
                    style={{ backgroundColor: finding.color }}
                  />
                  
                  <div className="relative z-10 text-center">
                    {finding.title && (
                      <h4 className="comic-title text-xs mb-3 uppercase tracking-wide opacity-70">
                        {finding.title}
                      </h4>
                    )}
                    
                    <div
                      className="comic-title mb-2"
                      style={{
                        fontSize: '3.5rem',
                        fontWeight: 'bold',
                        color: finding.color,
                        textShadow: `4px 4px 0px rgba(0,0,0,0.15)`,
                        lineHeight: 1.1
                      }}
                    >
                      {mainNumber}
                    </div>
                    
                    {remainingText && (
                      <p className="comic-text text-[10px] opacity-70">
                        {remainingText}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </ComicBox>

        {/* --- SECTION 1: GENERAL ANALYSIS Barplot overall --- */}
        <section>
          <ComicBox title="Number of Captions" className="mb-8">
            <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
              Over time, there is a steady increase in the number of captions submitted. This is probably due to the increasing popularity of the contest and the growing reach of The New Yorker Magazine.
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={frequency_caption} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 5 }} label={{ value: 'Number of Captions', angle: -90 }} />
                <Tooltip contentStyle={{ border: '2px solid #1A1A1A' }} formatter={(value: any, name: any, item: any) => [`${value}%`, name]} />
                <Line type="bump" dataKey="num_captions" stroke="#2A9D8F" dot={false} strokeWidth={3} name="number of caption" />
              </LineChart>
            </ResponsiveContainer>

          </ComicBox>
          <ComicBox title="Number of Votes" className="mb-8">
            <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
              The New Yorker Cartoon Caption Contest uses an algorithm developed by UW-Madison professor Robert Nowak to rank thousands of submitted captions based on public votes.
              Voters rate each caption they see as "Funny," "Somewhat funny," or "Unfunny," and the system adaptively shows more promising captions (those with early positive ratings) to additional voters while deprioritizing weaker ones, similar to search engine ranking.
              The algorithm collects raw ratings without analyzing caption text, relying solely on vote volume and quality for objectivity.
              Captions often receive more "Unfunny" votes than "Funny" ones because submissions vastly outnumber truly humorous ones, and the system exposes even low performers to many voters for accurate sorting.
              <a href="https://www.wpr.org/science-and-technology/how-uw-madison-professors-algorithm-helps-find-new-yorkers-cartoon-caption">[2] </a>

            </p>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={summary_votes} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 5 }} label={{ value: 'Number of Votes', angle: -90 }} />
                <Tooltip contentStyle={{ border: '2px solid #1A1A1A' }} formatter={(value: any, name: any, item: any) => [`${value}`, name]} />

                <Area
                  type="monotone"
                  dataKey="total_votes"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={1}

                />
                <Area
                  type="monotone"
                  dataKey="total_not_funny"
                  stroke="#E63946"
                  fillOpacity={1}
                  fill="#E63946"
                />
                <Area
                  type="monotone"
                  dataKey="total_somewhat_funny"
                  stroke="#2A9D8F"
                  fillOpacity={1}
                  fill="#2A9D8F"
                />
                <Area
                  type="monotone"
                  dataKey="total_funny"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="#82ca9d"
                />
              </AreaChart>
            </ResponsiveContainer>
            <AnalysisText>
              The maximum number of votes submitted for a cartoon is <strong>2,210,972</strong> on January 14, 2019. The minimum number is <strong>16,894</strong> on March 27, 2016.
            </AnalysisText>
          </ComicBox>

          <ComicBox title="Places" className="mb-8">
            <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
              There are several rather unsurprising locations that are frequently depicted in the cartoons.
            </p>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={image_location} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" opacity={0.1} />
                  <XAxis type="number" tick={{ fontSize: 9, fill: '#1A1A1A' }} stroke="#1A1A1A" />
                  <YAxis
                    type="category"
                    dataKey="term"
                    tick={{ fontSize: 10, fill: '#1A1A1A' }}
                    stroke="#1A1A1A"
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      border: '2px solid #1A1A1A',
                      borderRadius: '4px',
                      fontSize: '10px'
                    }}
                  />
                  <Bar dataKey="count" fill="#F4A261" stroke="#1A1A1A" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </ComicBox>

          <ComicBox title="Image description" className="mb-8">
            <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
              In most cartoons people are depicted. They do rather boring things like standing, sitting or talking which is then often contrasted with an absurd situation.
            </p>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={image_description} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" opacity={0.1} />
                  <XAxis type="number" tick={{ fontSize: 9, fill: '#1A1A1A' }} stroke="#1A1A1A" />
                  <YAxis
                    type="category"
                    dataKey="term"
                    tick={{ fontSize: 10, fill: '#1A1A1A' }}
                    stroke="#1A1A1A"
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      border: '2px solid #1A1A1A',
                      borderRadius: '4px',
                      fontSize: '10px'
                    }}
                  />
                  <Bar dataKey="count" fill="#F4A261" stroke="#1A1A1A" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ComicBox>

          <div className="inline-block mb-2 px-3 py-2 bg-[#F4A261] border-3 border-[#1A1A1A]">
            <h2 className="comic-title text-xs text-[#FDFDF8]">Cartoons with most captions</h2> {/* text-xs */}
          </div>
          <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
            The following cartoons received the highest number of caption submissions.
          </p>
          {/* Parent Container - Full width for 3 boxes */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '16px', // tighter spacing
              width: '100%',
              maxWidth: '100vw', // full viewport width
              padding: '0 10px', // small side padding
              flexWrap: 'wrap', // responsive fallback
            }}
          >

            {/* Single Box - Reduced size */}
            {[716, 744, 740].map((i) => (
              <div
                key={i}
                style={{
                  width: '300px',      // Reduced from 440px
                  maxWidth: 'calc(33.33vw - 20px)', // Responsive: ~1/3 viewport minus gaps
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >

                <p className="comic-text text-xs mb-4 text-center w-full" style={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                  #{i}
                </p>

                <div
                  style={{
                    width: '100%',
                    height: '280px',     // Reduced from 350px
                    border: '4px solid #000000ff', // Slightly thinner border
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '3px 3px 0 #1A1A1A', // Slightly smaller shadow
                  }}
                >
                  <img
                    src={`${basePath}/data/images/${i}.jpg`}
                    alt={`New Yorker Cartoon ${i}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>


        </section>
      </div>
    </div>
  );
}
