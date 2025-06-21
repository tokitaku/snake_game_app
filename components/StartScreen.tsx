
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-green-400">ヘビ単語ゲーム！</h2>
      <p className="mb-4 text-gray-300">
        矢印キーまたはWASDキーを使ってヘビを操作し、表示される正しい文字を集めて単語を完成させましょう。
      </p>
      <p className="mb-4 text-gray-300">
        文字は単語の正しい順番で集めなければなりません。
      </p>
      <p className="mb-4 text-gray-300">
        画面には正しい文字と一緒に、いくつかの<strong className="text-yellow-400">ダミー文字</strong>も表示されます。
        <strong className="text-red-500">ダミー文字を食べるとゲームオーバーです。</strong>
      </p>
      <p className="mb-8 text-gray-300">
        壁や自分自身にぶつからないように注意してください！
      </p>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
      >
        ゲーム開始
      </button>
    </div>
  );
};

export default StartScreen;
