import React from 'react'
import styles from '../../styles/Home.module.css'

interface Props {
    // isChecked: boolean;    
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
}

const Checkbox = (props: Props) => {
    return (
        <li className={styles.prefectures__item}>
            <input id={props.value} className={styles.prefectures_checkbox} type="checkbox" value={props.value} onChange={props.handleChange} />
            <label className={styles.prefectures_label} htmlFor={props.value}>{props.label}</label>
        </li>        
    );
};
export default Checkbox;