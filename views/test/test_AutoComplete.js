import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AutoComplete } from 'antd';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const test_AutoComplete = () => {

    const [state, setstate] = useState([{}]);

    useEffect(() => {
        axios.get('http://hitalk-investment.hitalkplus.com:4050/StockCode?ETF=1')
            .then((response) => {

                response.data.datalist.map((list, index) => {
                    delete list.reason;
                    delete list.dtfchk;
                    delete list.reason_no;
                    delete list.type;
                    delete list.etfchk;
                })

                setstate(response.data.datalist);
            })
    }, [])

    return (
        <>
            <Autocomplete
                id="highlights-demo"
                style={{ width: '100%' }}
                options={state}
                getOptionLabel={(option) => option.name + "  |  " + option.code}
                renderInput={(params) => (
                    <TextField {...params} label="종목" variant="outlined" margin="normal" />
                )}
                renderOption={(option, { inputValue }) => {
                    const matches = match(option.name + '  |  ' + option.code, inputValue);
                    const parts = parse(option.name + ' | ' + option.code, matches);

                    return (
                        <div>
                            {parts.map((part, index) => (
                                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                    {part.text}
                                </span>
                            ))}
                        </div>
                    );
                }}
            />
        </>
    )
}

export default test_AutoComplete;
