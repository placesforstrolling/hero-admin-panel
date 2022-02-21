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

    const {filters, filtersLoadingStatus} = useSelector(state => state.filters);
    const {heroes, heroesLoadingStatus} = useSelector(state => state.heroes);
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

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }
        
        // Если фильтры есть, то рендерим их
        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                // Один из фильтров нам тут не нужен
                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <Formik
            initialValues = {{
                id: '',
                name: '',
                description: '',
                element: '',
                
            }}
            onSubmit = {(data, {setSubmitting, resetForm}) => {
                dispatch(addHero(addHeroSubmit(data)))
                resetForm();
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
                    {renderFilters(filters, filtersLoadingStatus)}
                </Field>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </Form>
        </Formik>
    )
}

export default HeroesAddForm;