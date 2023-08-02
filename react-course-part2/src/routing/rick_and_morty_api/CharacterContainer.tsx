interface Props {
  character: Character;
}

export const CharacterCard = ({ character }: Props) => {
  return (
    <div className='card' style={{ width: '18rem' }}>
      <img className='card-img-top' src={character.image} alt='Card image cap'></img>
      <div className='card-body'>
        <h5 className='card-title'>{character.name}</h5>
        <p className='card-text'>
          {character.species}, {character.gender}
        </p>
        <p className='card-text'>{character.location.name}</p>
      </div>
    </div>
  );
};
