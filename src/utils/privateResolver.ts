const privateResolver = resolverFunction => async (
    parent,
    args,
    context,
    info
) => {
    if (!context.req.user) {
        throw new Error('Token이 존재하지 않습니다. 더 이상 진행할 수 없습니다.')
    }
    const resolved = await resolverFunction(parent, args, context, info);
    return resolved;
}

export default privateResolver