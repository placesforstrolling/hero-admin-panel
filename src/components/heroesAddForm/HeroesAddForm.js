import {useHttp} from '../../hooks/http.hook';
import {useDispatch, useSelector} from 'react-redux';
import {addHero, heroesFetchingError} from '../../actions';
import {Formik, Form, Field} from "formik";
import {v4 as uuid} from 'uuid';



// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {

    const {heroes, heroesLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const addHeroSubmit = (data) => {

        data.id = uuid();
        let newHeroes = heroes;
        newHeroes.push(data);

        request("http://localhost:3001/heroes", "POST", JSON.stringify(data))
            .catch(() => dispatch(heroesFetchingError()))

        return newHeroes;
    }

    return (
        <Formik
            initialValues = {{
                id: '',
                name: '',
                description: '',
                element: '',
                
            }}
            onSubmit = {(data) => {
                dispatch(addHero(addHeroSubmit(data)))
            }}
            >
            <Form className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <Field 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <Field
                    required
                    as="textarea"
                    name="description" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <Field 
                    required
                    as="select"
                    className="form-select" 
                    id="element" 
                    name="element">
                    <option >Я владею элементом...</option>
                    <option value="fire">Огонь</option>
                    <option value="water">Вода</option>
                    <option value="wind">Ветер</option>
                    <option value="earth">Земля</option>
                </Field>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </Form>
        </Formik>
    )
}

export default HeroesAddForm;