import {Component} from 'react'
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png'
import MarvelService from '../../services/MarvelService'
import ErrorMessage from '../errorMessage/ErrorMessage'
import Spinner from '../spinner/Spinner';

class RandomChar extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService()

    componentDidMount() {
        this.updateChar()
        this.timerId = setInterval((this.updateChar, 3000));
    }

    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    } 

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }
   
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    render() {
        const {char, loading, error} = this.state
        const errorMessage = error ? <ErrorMessage/> : null
        const spinner = loading ? <Spinner/> : null
        const content = !(spinner || errorMessage) ? <View char={char}/> : null

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div className="inner" onClick={this.updateChar}>try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char
        
    let objFit = 'cover'
    if(thumbnail.indexOf('image_not_available') !== -1) {
       objFit = 'contain' 
    }

    let DescMes = description;

    if(!description) {
        DescMes = 'There is no description'
    }

    if(DescMes.length > 170) {
        DescMes = DescMes.slice(0, 167) + '...' 
    }

    return (
            <div className="randomchar__block">
                <img src={thumbnail} alt="Random character" style={{objectFit: objFit}} className="randomchar__img"/>
                <div className="randomchar__info">
                    <p className="randomchar__name">{name}</p>
                    <p className="randomchar__descr">
                        {DescMes}
                    </p>
                    <div className="randomchar__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
    )
}

export default RandomChar;