import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Checkbox from './components/checkbox'

// Highcharts　インポート
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface Prefecture {  
  prefCode: string;
  prefName: string;
}

const Home: NextPage = () => {
  const apikey = '4PEGxNuvFwDzAGtJQcwKGy3iSmJgp3yNElwSpux5';                        //  RESAS(地域経済分析システム) API Key
  const url_prefectures = 'https://opendata.resas-portal.go.jp/api/v1/prefectures'; //  「都道府県一覧」獲得 URL

  let selectedPrefCodeList = [];                                                    //  「都道府県一覧」チェックリスト

  const requestMetadata = {                                                         //  RESAS(地域経済分析システム) APIのヘッダー
    method: 'GET',
    headers: {
        'X-API-KEY': apikey
    },
  };
  
  const [ guideswitch, SetGuideSwitch ] = useState('display');        //  説明文の表示 (「都道府県を選択してください。」)
  const [ prefecture, SetPrefecture ]   = useState({ result: [] });   //  都道府県一覧
  const [ population, SetPopulation ]   = useState({xAxis: {          //  人口グラフ
        title: {
          text: '年度'
        },
        categories: []
      },
      yAxis: {
        title: {
            text: '人口数'
        }
      },
      title: {
        text: '総人口推移グラフ'
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      series: []
    });
  
  useEffect(() => {    
    fetch(url_prefectures, requestMetadata)
      .then(res => res.json())
      .then(
        (result) => {
          SetPrefecture(result);
          console.log(result);
        },        
        (error) => {
          console.log(error);
        }
      )
  }, []);
  
  const handleChange = (evt: any): void => {
    const target = evt.target;
    const checked = target.checked;
    const value = target.value;
    console.log(target);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>都道府県別の総人口推移グラフ</title>
        <meta name="description" content="都道府県別の総人口推移グラフ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          都道府県別の総人口推移グラフ
        </h1>        
      </main>

      <div className={styles.main_content}>
        <div className={styles.prefectures_list}>
          <h3>都道府県</h3>
          <div>
            <ul className={styles.prefectures_itemlist}>
              {prefecture.result.map((item: Prefecture, idx) => {
                return (
                  <li className={styles.prefectures_item} key={idx}>
                    <Checkbox                      
                      label={item.prefName}
                      value={item.prefCode}
                      handleChange={handleChange}
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        
        <div className={styles.guidetext_display}>
          都道府県を選択してください。
        </div>
        <div className={styles.population_graph}>
          
        </div>
      </div>

    </div>
  )
}

export default Home
