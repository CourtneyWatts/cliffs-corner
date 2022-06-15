import { useState } from 'react'

export default (initialVal) => {
  const [state, setState] = useState(initialVal)
  const handleChange = e => {
    const { name, value } = e.target;
    setState(prevState => ({
        ...prevState,
        [name]: value
    }));
};
  const reset = () => {
    setState({})
  }
  const handleUpdate = (initialVal) => {
    setState(parseFloat(initialVal))
  }
  return [state, handleChange, reset, handleUpdate]
}
