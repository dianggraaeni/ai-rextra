import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

const FinalCTAContent = () => {
  return (
    <div className="container mx-auto px-6 text-center transition-all duration-1000 opacity-100 translate-y-0">
      <h2 className="text-4xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300">
        Ready to Discover Your Career Path?
      </h2>
      <p className="text-xl text-cyan-100 mb-12 max-w-2xl mx-auto">
        Mulai perjalanan penemuan karier Anda hari ini dan temukan potensi yang
        selama ini tersembunyi dalam diri Anda.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        {/* <Link
          to="/test-riasec"
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center group"
        >
          <Target className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
          Mulai Tes Gratis
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
        </Link> */}

        <Link
          to="/start-test"
          className="bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white/20 flex items-center justify-center group"
        >
          <Sparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
          Unlock Premium Report
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default FinalCTAContent;
