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
let selectedPrefCodeList: any = [];                                                 //  「都道府県一覧」チェックリスト
let series_value: any = [];
            
const Home: NextPage = () => {
  const apikey = '4PEGxNuvFwDzAGtJQcwKGy3iSmJgp3yNElwSpux5';                        //  RESAS(地域経済分析システム) API Key
  const url_prefectures = 'https://opendata.resas-portal.go.jp/api/v1/prefectures'; //  「都道府県一覧」獲得 URL
  const url_population  = 'https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=';   //  「総人口」獲得 URL

  const requestMetadata = {                                                         //  RESAS(地域経済分析システム) APIのヘッダー
    method: 'GET',
    headers: {
        'X-API-KEY': apikey
    },
  };
  
  const [ guideswitch, SetGuideSwitch ] = useState('display');        //  説明文の表示 (「都道府県を選択してください。」)
  const [ prefecture, SetPrefecture ]   = useState({ result: [] });   //  都道府県一覧
  const [ population, SetPopulation ]   = useState({});               //  人口グラフ
  
  useEffect(() => {    
    fetch(url_prefectures, requestMetadata)
      .then(res => res.json())
      .then(
        (result) => {
          SetPrefecture(result);
          SetPopulation({                 
            xAxis: {          
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
              text: ''
            },
            legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle'
            },
            series: []
          });          
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

    //  選択した都道府県名
    let prefecture_name: string = '';
    prefecture.result.map((item: Prefecture) => {
      if(item.prefCode == value) {
        prefecture_name = item.prefName;
      }
    });

    //  選択した都道府県の総人口データを取得する
    if(checked) {      
      const fetchURL = url_population + value;
      fetch(fetchURL, requestMetadata)
        .then(res => res.json())
        .then(
          (result) => {
            const yearvalue: any = [];
            const categorie_names: any = [];
            
            result.result.data[0].data.map( (year_value:any) => {
              yearvalue.push(year_value.value);
              categorie_names.push(year_value.year);
            })
            //  グラフの人口データ
            series_value.push({
              name: prefecture_name,
              data: yearvalue
            });

            //  グラフ値の設定
            SetPopulation({ 
              xAxis: {
                categories: categorie_names
              },
              series: series_value
            });
          },        
          (error) => {
            console.log(error);
          }
        )
    }
    else {
      //  チェック解除した都道府県のグラフデータ削除
      series_value = series_value.filter((item: any) => item.name !== prefecture_name);
      SetPopulation({ 
        series: series_value
      });
    }
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
        
        <div className={styles.population_graph}>
          <HighchartsReact highcharts={Highcharts} options={population} />
        </div>
      </div>

    </div>
  )
}

export default Home
