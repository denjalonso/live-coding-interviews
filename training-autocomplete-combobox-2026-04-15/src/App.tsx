import {useEffect, useState, PropsWithChildren} from 'react';
import {debounce} from 'lodash' // not going to reinvent the wheel
import {Input, Modal} from './lib' // not going to reinvent the wheel
import './App.css';


const OPTIONS_URL = 'https://something?q='

/**
 * we assume the following response: where option: Option<unknown>[]
 * [
 *     {..option1},
 *     {..option2},
 *     {..option3},
 * ]
 *
 * */

type FetchOptionsProps = {
    query: string,
    signal?: AbortSignal
}

function fetchOptions<T>({query, signal}: FetchOptionsProps): Promise<Option<T>[]> {
    return fetch(`${OPTIONS_URL}${query}`, {signal}).then(res => res.json());
}

function Modal() {
    return null;
}

// Assumption: we are gonna be closer as much as possible to html standars
type Option<T> = {
    id: string
    value: T
}

type ComboboxProps<T> = {
    onSearch: (query: string, signal: AbortSignal) => Promise<Option<T>[]>
    getOptionLabel: T
    getOptionKey: string
}

function Option<T>({children}: PropsWithChildren) {
    return <option>{children}</option>;
}

function Combobox<T>({onSearch, getOptionKey, getOptionLabel}: ComboboxProps<T>) {
    const [query, setQuery] = useState('')
    const [options, setOptions] = useState<Option<T>[]>(() => {
        return fetchOptions<T>({query})
    })
    // loading is an out of the box
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const {signal, abort} = new AbortController()
        if (query && query != '') {
            fetchOptions({query, signal}).then(data => setOptions(data))
        }

        return () => {
            abort()
        }
    }, [query]);

    // keyboard navigation out of the box
    useEffect(() => {

    })

    if (loading) {
        return <>Loading...</>
    }

    if (options.length === 0) {
        return <>no options</>
    }

    return <Input type="text" role="combobox" onChange={(q: string) => debounce(setQuery(q))}>
        <Modal>
            {options.map((op) => {
                return <Option<T> key={op.id}>{op.value}</Option>
            })}
        </Modal>
    </Input>
}

function App() {
    const [selectedOption, setSelectedOption] = useState(0);

    return (
        <>

        </>
    );
}

export default App;
